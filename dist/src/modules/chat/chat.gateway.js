"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
let ChatGateway = class ChatGateway {
    server;
    connectedUsers = new Map();
    handleConnection(client) {
        console.log(`Client connected: ${client.id}`);
    }
    handleDisconnect(client) {
        console.log(`Client disconnected: ${client.id}`);
        this.connectedUsers.delete(client.id);
    }
    handleAuthenticate(payload, client) {
        const tenantRoom = `school_${payload.schoolId}`;
        client.join(tenantRoom);
        const personalRoom = `user_${payload.schoolId}_${payload.userId}`;
        client.join(personalRoom);
        this.connectedUsers.set(client.id, payload);
        console.log(`User ${payload.userId} (Role: ${payload.role}) authenticated in ${tenantRoom}`);
        return { status: 'success', message: 'Authenticated and joined rooms' };
    }
    handleDirectMessage(payload, client) {
        const sender = this.connectedUsers.get(client.id);
        if (!sender)
            return { status: 'error', message: 'Not authenticated' };
        const targetRoom = `user_${sender.schoolId}_${payload.targetUserId}`;
        this.server.to(targetRoom).emit('receiveMessage', {
            fromUserId: sender.userId,
            fromRole: sender.role,
            message: payload.message,
            timestamp: new Date().toISOString(),
        });
        return { status: 'success' };
    }
    handleBulkMessage(payload, client) {
        const sender = this.connectedUsers.get(client.id);
        if (!sender)
            return { status: 'error', message: 'Not authenticated' };
        if (sender.role !== 'TEACHER' && sender.role !== 'SCHOOL_ADMIN' && sender.role !== 'SUPER_ADMIN') {
            return { status: 'error', message: 'Unauthorized: Only teachers/admins can bulk message' };
        }
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
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('authenticate'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleAuthenticate", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('sendDirectMessage'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleDirectMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('sendBulkMessage'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleBulkMessage", null);
exports.ChatGateway = ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
    })
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map