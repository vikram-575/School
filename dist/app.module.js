"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AppModule", {
    enumerable: true,
    get: function() {
        return AppModule;
    }
});
const _common = require("@nestjs/common");
const _appcontroller = require("./app.controller");
const _appservice = require("./app.service");
const _usersmodule = require("./users/users.module");
const _schoolsmodule = require("./schools/schools.module");
const _academicsmodule = require("./academics/academics.module");
const _financemodule = require("./finance/finance.module");
const _chatmodule = require("./modules/chat/chat.module");
const _authmodule = require("./auth/auth.module");
const _tenantmiddleware = require("./core/tenant.middleware");
const _operationsmodule = require("./operations/operations.module");
const _dashboardmodule = require("./dashboard/dashboard.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(_tenantmiddleware.TenantMiddleware).forRoutes({
            path: '*',
            method: _common.RequestMethod.ALL
        });
    }
};
AppModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _authmodule.AuthModule,
            _usersmodule.UsersModule,
            _schoolsmodule.SchoolsModule,
            _academicsmodule.AcademicsModule,
            _financemodule.FinanceModule,
            _chatmodule.ChatModule,
            _operationsmodule.OperationsModule,
            _dashboardmodule.DashboardModule
        ],
        controllers: [
            _appcontroller.AppController
        ],
        providers: [
            _appservice.AppService
        ]
    })
], AppModule);

//# sourceMappingURL=app.module.js.map