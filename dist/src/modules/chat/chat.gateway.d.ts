import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    private connectedUsers;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleAuthenticate(payload: {
        userId: string;
        schoolId: string;
        role: string;
    }, client: Socket): {
        status: string;
        message: string;
    };
    handleDirectMessage(payload: {
        targetUserId: string;
        message: string;
    }, client: Socket): {
        status: string;
        message: string;
    } | {
        status: string;
        message?: undefined;
    };
    handleBulkMessage(payload: {
        targetUserIds: string[];
        message: string;
    }, client: Socket): {
        status: string;
        message: string;
    };
}
