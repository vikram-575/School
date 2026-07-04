import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { tenantContext } from '../core/tenant.context';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  public readonly extended = this.$extends({
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          const context = tenantContext.getStore();
          const schoolId = context?.schoolId;

          // Only inject schoolId for models that have a schoolId field
          // For now, we manually list models that are NOT tenant-specific
          const globalModels = ['School', 'Plan', 'Subscription'];
          
          if (schoolId && !globalModels.includes(model)) {
            if (operation === 'findUnique' || operation === 'findFirst' || operation === 'findMany' || operation === 'count' || operation === 'update' || operation === 'updateMany' || operation === 'delete' || operation === 'deleteMany') {
              args.where = { ...args.where, schoolId };
            } else if (operation === 'create' || operation === 'createMany') {
              (args.data as any) = Array.isArray(args.data) 
                ? (args.data as any[]).map(d => ({ ...d, schoolId })) 
                : { ...(args.data as any), schoolId };
            }
          }

          // Soft delete injection
          if (operation === 'findUnique' || operation === 'findFirst' || operation === 'findMany' || operation === 'count') {
            args.where = { ...args.where, deletedAt: null };
          }
          if (operation === 'delete') {
            // Convert delete to soft delete (update)
            return (this as any)[model].update({
              where: args.where,
              data: { deletedAt: new Date() },
            });
          }
          if (operation === 'deleteMany') {
            return (this as any)[model].updateMany({
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
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
