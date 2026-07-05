"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _testing = require("@nestjs/testing");
const _operationscontroller = require("./operations.controller");
describe('OperationsController', ()=>{
    let controller;
    beforeEach(async ()=>{
        const module = await _testing.Test.createTestingModule({
            controllers: [
                _operationscontroller.OperationsController
            ]
        }).compile();
        controller = module.get(_operationscontroller.OperationsController);
    });
    it('should be defined', ()=>{
        expect(controller).toBeDefined();
    });
});

//# sourceMappingURL=operations.controller.spec.js.map