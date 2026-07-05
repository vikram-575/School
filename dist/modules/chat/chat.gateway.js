"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ChatGateway", {
    enumerable: true,
    get: function() {
        return ChatGateway;
    }
});
const _websockets = require("@nestjs/websockets");
const _socketio = require("socket.io");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let ChatGateway = class ChatGateway {
    handleConnection(client) {
        // In a real production app, we would parse the JWT from client.handshake.headers.authorization
        // For this prototype, we'll expect the client to emit an 'authenticate' event
        console.log(`Client connected: ${client.id}`);
    }
    handleDisconnect(client) {
        console.log(`Client disconnected: ${client.id}`);
        this.connectedUsers.delete(client.id);
    }
    handleAuthenticate(payload, client) {
        // Join tenant-specific room to ensure isolation
        const tenantRoom = `school_${payload.schoolId}`;
        client.join(tenantRoom);
        // Also join a personal room for direct messages
        const personalRoom = `user_${payload.schoolId}_${payload.userId}`;
        client.join(personalRoom);
        // Save metadata
        this.connectedUsers.set(client.id, payload);
        console.log(`User ${payload.userId} (Role: ${payload.role}) authenticated in ${tenantRoom}`);
        return {
            status: 'success',
            message: 'Authenticated and joined rooms'
        };
    }
    handleDirectMessage(payload, client) {
        const sender = this.connectedUsers.get(client.id);
        if (!sender) return {
            status: 'error',
            message: 'Not authenticated'
        };
        // Enforcement: Parents/Students can only message Teachers (or Admins).
        // In a full implementation, we'd query the DB to verify the target's role.
        const targetRoom = `user_${sender.schoolId}_${payload.targetUserId}`;
        this.server.to(targetRoom).emit('receiveMessage', {
            fromUserId: sender.userId,
            fromRole: sender.role,
            message: payload.message,
            timestamp: new Date().toISOString()
        });
        return {
            status: 'success'
        };
    }
    handleBulkMessage(payload, client) {
        const sender = this.connectedUsers.get(client.id);
        if (!sender) return {
            status: 'error',
            message: 'Not authenticated'
        };
        // Enforcement: Only Teachers and Admins can send bulk messages.
        if (sender.role !== 'TEACHER' && sender.role !== 'SCHOOL_ADMIN' && sender.role !== 'SUPER_ADMIN') {
            return {
                status: 'error',
                message: 'Unauthorized: Only teachers/admins can bulk message'
            };
        }
        // Emit to each target's personal room within the same school
        payload.targetUserIds.forEach((targetId)=>{
            const targetRoom = `user_${sender.schoolId}_${targetId}`;
            this.server.to(targetRoom).emit('receiveMessage', {
                fromUserId: sender.userId,
                fromRole: sender.role,
                message: payload.message,
                isBulk: true,
                timestamp: new Date().toISOString()
            });
        });
        return {
            status: 'success',
            message: `Message sent to ${payload.targetUserIds.length} users.`
        };
    }
    constructor(){
        // Track connected users: socketId -> { userId, schoolId, role }
        this.connectedUsers = new Map();
    }
};
_ts_decorate([
    (0, _websockets.WebSocketServer)(),
    _ts_metadata("design:type", typeof _socketio.Server === "undefined" ? Object : _socketio.Server)
], ChatGateway.prototype, "server", void 0);
_ts_decorate([
    (0, _websockets.SubscribeMessage)('authenticate'),
    _ts_param(0, (0, _websockets.MessageBody)()),
    _ts_param(1, (0, _websockets.ConnectedSocket)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object,
        typeof _socketio.Socket === "undefined" ? Object : _socketio.Socket
    ]),
    _ts_metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleAuthenticate", null);
_ts_decorate([
    (0, _websockets.SubscribeMessage)('sendDirectMessage'),
    _ts_param(0, (0, _websockets.MessageBody)()),
    _ts_param(1, (0, _websockets.ConnectedSocket)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object,
        typeof _socketio.Socket === "undefined" ? Object : _socketio.Socket
    ]),
    _ts_metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleDirectMessage", null);
_ts_decorate([
    (0, _websockets.SubscribeMessage)('sendBulkMessage'),
    _ts_param(0, (0, _websockets.MessageBody)()),
    _ts_param(1, (0, _websockets.ConnectedSocket)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object,
        typeof _socketio.Socket === "undefined" ? Object : _socketio.Socket
    ]),
    _ts_metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleBulkMessage", null);
ChatGateway = _ts_decorate([
    (0, _websockets.WebSocketGateway)({
        cors: {
            origin: '*'
        }
    })
], ChatGateway);

//# sourceMappingURL=chat.gateway.js.map