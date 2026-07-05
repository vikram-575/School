import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
export declare class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    readonly extended: import("@prisma/client/runtime/library").DynamicClientExtensionThis<import("@prisma/client").Prisma.TypeMap<import("@prisma/client/runtime/library").InternalArgs & {
        result: {};
        model: {};
        query: {};
        client: {};
    }>, import("@prisma/client").Prisma.TypeMapCb, {
        result: {};
        model: {};
        query: {};
        client: {};
    }>;
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
}
