import { AsyncLocalStorage } from 'async_hooks';

export interface TenantContext {
  schoolId?: string;
  userId?: string;
}

export const tenantContext = new AsyncLocalStorage<TenantContext>();
