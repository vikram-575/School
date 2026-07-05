"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _testing = require("@nestjs/testing");
const _operationsservice = require("./operations.service");
describe('OperationsService', ()=>{
    let service;
    beforeEach(async ()=>{
        const module = await _testing.Test.createTestingModule({
            providers: [
                _operationsservice.OperationsService
            ]
        }).compile();
        service = module.get(_operationsservice.OperationsService);
    });
    it('should be defined', ()=>{
        expect(service).toBeDefined();
    });
});

//# sourceMappingURL=operations.service.spec.js.map