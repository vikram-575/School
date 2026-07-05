"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FinanceModule", {
    enumerable: true,
    get: function() {
        return FinanceModule;
    }
});
const _common = require("@nestjs/common");
const _authmodule = require("../auth/auth.module");
const _prismamodule = require("../prisma/prisma.module");
const _financecontroller = require("./finance.controller");
const _financeservice = require("./finance.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let FinanceModule = class FinanceModule {
};
FinanceModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _prismamodule.PrismaModule,
            _authmodule.AuthModule
        ],
        controllers: [
            _financecontroller.FinanceController
        ],
        providers: [
            _financeservice.FinanceService
        ]
    })
], FinanceModule);

//# sourceMappingURL=finance.module.js.map