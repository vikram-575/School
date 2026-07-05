"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const tenant_context_1 = require("../core/tenant.context");
let PrismaService = class PrismaService extends client_1.PrismaClient {
    extended = this.$extends({
        query: {
            $allModels: {
                async $allOperations({ model, operation, args, query }) {
                    const context = tenant_context_1.tenantContext.getStore();
                    const schoolId = context?.schoolId;
                    const globalModels = ['School', 'Plan', 'Subscription'];
                    if (schoolId && !globalModels.includes(model)) {
                        if (operation === 'findUnique' || operation === 'findFirst' || operation === 'findMany' || operation === 'count' || operation === 'update' || operation === 'updateMany' || operation === 'delete' || operation === 'deleteMany') {
                            args.where = { ...args.where, schoolId };
                        }
                        else if (operation === 'create' || operation === 'createMany') {
                            args.data = Array.isArray(args.data)
                                ? args.data.map(d => ({ ...d, schoolId }))
                                : { ...args.data, schoolId };
                        }
                    }
                    if (operation === 'findUnique' || operation === 'findFirst' || operation === 'findMany' || operation === 'count') {
                        args.where = { ...args.where, deletedAt: null };
                    }
                    if (operation === 'delete') {
                        return this[model].update({
                            where: args.where,
                            data: { deletedAt: new Date() },
                        });
                    }
                    if (operation === 'deleteMany') {
                        return this[model].updateMany({
                            where: args.where,
                            data: { deletedAt: new Date() },
                        });
                    }
                    return query(args);
                },
            },
        },
    });
    async onModuleInit() {
        try {
            await this.$connect();
            console.log('Successfully connected to the database.');
        }
        catch (error) {
            console.error('FAILED TO CONNECT TO DATABASE ON STARTUP:', error.message);
            console.error('Check if DATABASE_URL is correctly set in your environment variables.');
        }
    }
    async onModuleDestroy() {
        try {
            await this.$disconnect();
        }
        catch (error) {
            console.error('Error disconnecting:', error);
        }
    }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = __decorate([
    (0, common_1.Injectable)()
], PrismaService);
//# sourceMappingURL=prisma.service.js.map