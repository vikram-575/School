import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { tenantContext } from './tenant.context';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    let schoolId: string | undefined;
    let userId: string | undefined;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        const decoded = this.jwtService.decode(token) as any;
        if (decoded) {
          schoolId = decoded.schoolId;
          userId = decoded.sub;
        }
      } catch (err) {
        // Token is invalid, ignore or handle in JwtGuard
      }
    }

    // Run the rest of the request within the AsyncLocalStorage context
    tenantContext.run({ schoolId, userId }, () => {
      next();
    });
  }
}
