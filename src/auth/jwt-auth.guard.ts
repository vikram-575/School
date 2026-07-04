import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

export type AuthenticatedUser = {
  sub: string;
  email?: string;
  role: string;
  schoolId?: string | null;
};

export type AuthenticatedRequest = Request & {
  headers: Record<string, string | string[] | undefined>;
  user: AuthenticatedUser;
  tenantId?: string | null;
};

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const req = request as any;
    const authHeader = req.headers?.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return false;
    }

    const token = authHeader.split(' ')[1];
    try {
      const supabaseUrl = process.env.SUPABASE_URL || '';
      const supabaseKey = process.env.SUPABASE_KEY || '';
      
      const { createClient } = require('@supabase/supabase-js');
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      const { data, error } = await supabase.auth.getUser(token);
      
      if (error || !data.user) {
        console.error('JwtAuthGuard: Supabase error:', error);
        throw new ForbiddenException('Invalid or expired token from Supabase');
      }

      console.log('JwtAuthGuard: Supabase user found:', data.user.id, data.user.email);

      // Supabase payload has 'sub' as the user's ID
      let user = await this.prisma.user.findUnique({
        where: { id: data.user.id },
        include: { role: true }
      });

      // Fallback: Check by email in case of legacy token or manual setup mismatch
      if (!user && data.user.email) {
        console.log('JwtAuthGuard: User not found by ID, checking by email:', data.user.email);
        user = await this.prisma.user.findFirst({
           where: { email: data.user.email },
           include: { role: true }
        });
      }

      if (!user) {
         console.error('JwtAuthGuard: User not found in database for id:', data.user.id);
         throw new ForbiddenException('User not found in database');
      }
      
      console.log('JwtAuthGuard: User authorized successfully with role:', user.role.name);

      req.user = {
        sub: user.id,
        email: user.email,
        role: user.role.name,
        schoolId: user.schoolId
      };
      
      const requestedSchoolId = req.query.schoolId 
          ? (req.query.schoolId as string) 
          : req.headers['x-tenant-id'] 
          ? (req.headers['x-tenant-id'] as string) 
          : req.user.schoolId ?? null;
      req.tenantId = requestedSchoolId;
      return true;
    } catch (error) {
      console.error('JwtAuthGuard Error:', error);
      if (error instanceof UnauthorizedException || error instanceof ForbiddenException) {
         throw error;
      }
      throw new ForbiddenException('Invalid token');
    }
  }
}
