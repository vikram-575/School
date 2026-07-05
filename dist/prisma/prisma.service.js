"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PrismaService", {
    enumerable: true,
    get: function() {
        return PrismaService;
    }
});
const _common = require("@nestjs/common");
const _client = require("@prisma/client");
const _tenantcontext = require("../core/tenant.context");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let PrismaService = class PrismaService extends _client.PrismaClient {
    async onModuleInit() {
        try {
            await this.$connect();
            console.log('Successfully connected to the database.');
        } catch (error) {
            console.error('FAILED TO CONNECT TO DATABASE ON STARTUP:', error.message);
            console.error('Check if DATABASE_URL is correctly set in your environment variables.');
        }
    }
    async onModuleDestroy() {
        try {
            await this.$disconnect();
        } catch (error) {
            console.error('Error disconnecting:', error);
        }
    }
    constructor(...args){
        super(...args), this.extended = this.$extends({
            query: {
                $allModels: {
                    async $allOperations ({ model, operation, args, query }) {
                        const context = _tenantcontext.tenantContext.getStore();
                        const schoolId = context?.schoolId;
                        // Only inject schoolId for models that have a schoolId field
                        // For now, we manually list models that are NOT tenant-specific
                        const globalModels = [
                            'School',
                            'Plan',
                            'Subscription'
                        ];
                        if (schoolId && !globalModels.includes(model)) {
                            if (operation === 'findUnique' || operation === 'findFirst' || operation === 'findMany' || operation === 'count' || operation === 'update' || operation === 'updateMany' || operation === 'delete' || operation === 'deleteMany') {
                                args.where = {
                                    ...args.where,
                                    schoolId
                                };
                            } else if (operation === 'create' || operation === 'createMany') {
                                args.data = Array.isArray(args.data) ? args.data.map((d)=>({
                                        ...d,
                                        schoolId
                                    })) : {
                                    ...args.data,
                                    schoolId
                                };
                            }
                        }
                        // Soft delete injection
                        if (operation === 'findUnique' || operation === 'findFirst' || operation === 'findMany' || operation === 'count') {
                            args.where = {
                                ...args.where,
                                deletedAt: null
                            };
                        }
                        if (operation === 'delete') {
                            // Convert delete to soft delete (update)
                            return this[model].update({
                                where: args.where,
                                data: {
                                    deletedAt: new Date()
                                }
                            });
                        }
                        if (operation === 'deleteMany') {
                            return this[model].updateMany({
                                where: args.where,
                                data: {
                                    deletedAt: new Date()
                                }
                            });
                        }
                        return query(args);
                    }
                }
            }
        });
    }
};
PrismaService = _ts_decorate([
    (0, _common.Injectable)()
], PrismaService);

//# sourceMappingURL=prisma.service.js.map