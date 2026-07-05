"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ExamsController", {
    enumerable: true,
    get: function() {
        return ExamsController;
    }
});
const _common = require("@nestjs/common");
const _jwtauthguard = require("../auth/jwt-auth.guard");
const _examsservice = require("./exams.service");
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
let ExamsController = class ExamsController {
    getExams(req) {
        return this.examsService.getExams(req.user.schoolId);
    }
    createExam(req, body) {
        return this.examsService.createExam(req.user.schoolId, body);
    }
    getExamResults(req, examId, sectionId) {
        return this.examsService.getExamResults(req.user.schoolId, examId, sectionId);
    }
    saveExamResult(req, body) {
        return this.examsService.saveExamResult(req.user.schoolId, body);
    }
    constructor(examsService){
        this.examsService = examsService;
    }
};
_ts_decorate([
    (0, _common.Get)(),
    _ts_param(0, (0, _common.Req)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object
    ]),
    _ts_metadata("design:returntype", void 0)
], ExamsController.prototype, "getExams", null);
_ts_decorate([
    (0, _common.Post)(),
    _ts_param(0, (0, _common.Req)()),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object,
        Object
    ]),
    _ts_metadata("design:returntype", void 0)
], ExamsController.prototype, "createExam", null);
_ts_decorate([
    (0, _common.Get)('results'),
    _ts_param(0, (0, _common.Req)()),
    _ts_param(1, (0, _common.Query)('examId')),
    _ts_param(2, (0, _common.Query)('sectionId')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object,
        String,
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], ExamsController.prototype, "getExamResults", null);
_ts_decorate([
    (0, _common.Post)('results'),
    _ts_param(0, (0, _common.Req)()),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object,
        Object
    ]),
    _ts_metadata("design:returntype", void 0)
], ExamsController.prototype, "saveExamResult", null);
ExamsController = _ts_decorate([
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _common.Controller)('exams'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _examsservice.ExamsService === "undefined" ? Object : _examsservice.ExamsService
    ])
], ExamsController);

//# sourceMappingURL=exams.controller.js.map