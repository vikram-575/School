import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  // Track connected users: socketId -> { userId, schoolId, role }
  private connectedUsers = new Map<string, any>();

  handleConnection(client: Socket) {
    // In a real production app, we would parse the JWT from client.handshake.headers.authorization
    // For this prototype, we'll expect the client to emit an 'authenticate' event
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.connectedUsers.delete(client.id);
  }

  @SubscribeMessage('authenticate')
  handleAuthenticate(
    @MessageBody() payload: { userId: string; schoolId: string; role: string },
    @ConnectedSocket() client: Socket,
  ) {
    // Join tenant-specific room to ensure isolation
    const tenantRoom = `school_${payload.schoolId}`;
    client.join(tenantRoom);
    
    // Also join a personal room for direct messages
    const personalRoom = `user_${payload.schoolId}_${payload.userId}`;
    client.join(personalRoom);

    // Save metadata
    this.connectedUsers.set(client.id, payload);
    console.log(`User ${payload.userId} (Role: ${payload.role}) authenticated in ${tenantRoom}`);
    
    return { status: 'success', message: 'Authenticated and joined rooms' };
  }

  @SubscribeMessage('sendDirectMessage')
  handleDirectMessage(
    @MessageBody() payload: { targetUserId: string; message: string },
    @ConnectedSocket() client: Socket,
  ) {
    const sender = this.connectedUsers.get(client.id);
    if (!sender) return { status: 'error', message: 'Not authenticated' };

    // Enforcement: Parents/Students can only message Teachers (or Admins).
    // In a full implementation, we'd query the DB to verify the target's role.
    
    const targetRoom = `user_${sender.schoolId}_${payload.targetUserId}`;
    
    this.server.to(targetRoom).emit('receiveMessage', {
      fromUserId: sender.userId,
      fromRole: sender.role,
      message: payload.message,
      timestamp: new Date().toISOString(),
    });
    
    return { status: 'success' };
  }

  @SubscribeMessage('sendBulkMessage')
  handleBulkMessage(
    @MessageBody() payload: { targetUserIds: string[]; message: string },
    @ConnectedSocket() client: Socket,
  ) {
    const sender = this.connectedUsers.get(client.id);
    if (!sender) return { status: 'error', message: 'Not authenticated' };

    // Enforcement: Only Teachers and Admins can send bulk messages.
    if (sender.role !== 'TEACHER' && sender.role !== 'SCHOOL_ADMIN' && sender.role !== 'SUPER_ADMIN') {
      return { status: 'error', message: 'Unauthorized: Only teachers/admins can bulk message' };
    }

    // Emit to each target's personal room within the same school
    payload.targetUserIds.forEach(targetId => {
      const targetRoom = `user_${sender.schoolId}_${targetId}`;
      this.server.to(targetRoom).emit('receiveMessage', {
        fromUserId: sender.userId,
        fromRole: sender.role,
        message: payload.message,
        isBulk: true,
        timestamp: new Date().toISOString(),
      });
    });
    
    return { status: 'success', message: `Message sent to ${payload.targetUserIds.length} users.` };
  }
}
