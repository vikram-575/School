"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AcademicsModule", {
    enumerable: true,
    get: function() {
        return AcademicsModule;
    }
});
const _common = require("@nestjs/common");
const _authmodule = require("../auth/auth.module");
const _prismamodule = require("../prisma/prisma.module");
const _academicscontroller = require("./academics.controller");
const _academicsservice = require("./academics.service");
const _examscontroller = require("./exams.controller");
const _examsservice = require("./exams.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let AcademicsModule = class AcademicsModule {
};
AcademicsModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _prismamodule.PrismaModule,
            _authmodule.AuthModule
        ],
        controllers: [
            _academicscontroller.AcademicsController,
            _examscontroller.ExamsController
        ],
        providers: [
            _academicsservice.AcademicsService,
            _examsservice.ExamsService
        ]
    })
], AcademicsModule);

//# sourceMappingURL=academics.module.js.map