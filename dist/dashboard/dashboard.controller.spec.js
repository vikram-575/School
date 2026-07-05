"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _testing = require("@nestjs/testing");
const _dashboardcontroller = require("./dashboard.controller");
describe('DashboardController', ()=>{
    let controller;
    beforeEach(async ()=>{
        const module = await _testing.Test.createTestingModule({
            controllers: [
                _dashboardcontroller.DashboardController
            ]
        }).compile();
        controller = module.get(_dashboardcontroller.DashboardController);
    });
    it('should be defined', ()=>{
        expect(controller).toBeDefined();
    });
});

//# sourceMappingURL=dashboard.controller.spec.js.map