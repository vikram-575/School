import { Injectable, NestInterceptor, ExecutionContext, CallHandler, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class TenantInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    
    // We assume an AuthGuard has already injected the user into the request
    const user = request.user;
    
    if (!user) {
      throw new UnauthorizedException('User context is missing');
    }

    // If the user is SUPER_ADMIN, they might not have a schoolId in their token.
    // If they do pass an 'x-tenant-id' header to act on behalf of a school, we can catch it.
    if (user.role === 'SUPER_ADMIN') {
        request.tenantId = request.headers['x-tenant-id'] || null;
    } else {
        // Enforce the schoolId strictly for everyone else
        if (!user.schoolId) {
            throw new UnauthorizedException('Tenant context is missing for non-super-admin user');
        }
        request.tenantId = user.schoolId;
    }

    // Now request.tenantId is guaranteed to hold the correct scoping ID.
    // This value will be extracted by controllers/services for Prisma queries.
    return next.handle();
  }
}
