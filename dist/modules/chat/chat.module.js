"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ChatModule", {
    enumerable: true,
    get: function() {
        return ChatModule;
    }
});
const _common = require("@nestjs/common");
const _authmodule = require("../../auth/auth.module");
const _prismamodule = require("../../prisma/prisma.module");
const _chatgateway = require("./chat.gateway");
const _messagescontroller = require("./messages.controller");
const _messagesservice = require("./messages.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let ChatModule = class ChatModule {
};
ChatModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _prismamodule.PrismaModule,
            _authmodule.AuthModule
        ],
        controllers: [
            _messagescontroller.MessagesController
        ],
        providers: [
            _chatgateway.ChatGateway,
            _messagesservice.MessagesService
        ]
    })
], ChatModule);

//# sourceMappingURL=chat.module.js.map