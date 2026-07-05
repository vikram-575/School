"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _testing = require("@nestjs/testing");
const _dashboardservice = require("./dashboard.service");
describe('DashboardService', ()=>{
    let service;
    beforeEach(async ()=>{
        const module = await _testing.Test.createTestingModule({
            providers: [
                _dashboardservice.DashboardService
            ]
        }).compile();
        service = module.get(_dashboardservice.DashboardService);
    });
    it('should be defined', ()=>{
        expect(service).toBeDefined();
    });
});

//# sourceMappingURL=dashboard.service.spec.js.map