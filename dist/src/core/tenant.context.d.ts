import { AsyncLocalStorage } from 'async_hooks';
export interface TenantContext {
    schoolId?: string;
    userId?: string;
}
export declare const tenantContext: AsyncLocalStorage<TenantContext>;
