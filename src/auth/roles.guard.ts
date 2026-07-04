import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true; // No roles required, allow access
    }
    const { user } = context.switchToHttp().getRequest();
    if (!user) {
      throw new ForbiddenException('User is not authenticated.');
    }

    const hasRole = requiredRoles.includes(user.role);
    if (!hasRole) {
      console.error(`RolesGuard: User has role ${user.role}, but requires ${requiredRoles}`);
      throw new ForbiddenException('You do not have the required role to access this resource.');
    }
    console.log(`RolesGuard: Authorized for role ${user.role}`);
    return true;
  }
}
