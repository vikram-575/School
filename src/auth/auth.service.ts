import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Role } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class AuthService {
  private supabase;

  constructor(private prisma: PrismaService) {
    this.supabase = createClient(
      process.env.SUPABASE_URL || 'http://localhost:54321', // Default local url
      process.env.SUPABASE_KEY || ''
    );
  }

  async validateUser(loginId?: string, pass?: string): Promise<(Omit<User, 'passwordHash'> & { role: Role }) | null> {
    if (!loginId || !pass) return null;
    
    // Check if it's an email
    if (loginId.includes('@')) {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email: loginId,
        password: pass,
      });
      if (error || !data.user) return null;
    } else {
      // Login via phone
      const { data, error } = await this.supabase.auth.signInWithPassword({
        phone: loginId,
        password: pass,
      });
      if (error || !data.user) return null;
    }

    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: loginId }, { phone: loginId }],
      },
      include: {
        role: true
      }
    });

    if (user) {
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginId: string, pass: string) {
    // Perform Supabase Login
    let authResponse;
    if (loginId.includes('@')) {
       authResponse = await this.supabase.auth.signInWithPassword({
         email: loginId,
         password: pass,
       });
    } else {
       authResponse = await this.supabase.auth.signInWithPassword({
         phone: loginId,
         password: pass,
       });
    }

    if (authResponse.error || !authResponse.data.session) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const dbUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: loginId }, { phone: loginId }],
      },
      include: {
        role: true
      }
    });

    if (!dbUser) {
       throw new UnauthorizedException('User not found in system database');
    }

    return {
      access_token: authResponse.data.session.access_token,
      refresh_token: authResponse.data.session.refresh_token,
      role: dbUser.role.name,
      user: dbUser,
    };
  }

  async refresh(refreshToken: string) {
    const { data, error } = await this.supabase.auth.refreshSession({ refresh_token: refreshToken });
    if (error || !data.session || !data.user) {
       throw new UnauthorizedException('Invalid or expired refresh token');
    }
    
    const dbUser = await this.prisma.user.findFirst({
      where: { email: data.user.email },
      include: { role: true }
    });

    return {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      role: dbUser?.role?.name,
      user: dbUser,
    };
  }

  async logout(accessToken: string) {
    const { error } = await this.supabase.auth.signOut(); // Requires context of token if called on behalf of user, better to let client clear local session
    // Since we don't have the user token here easily without passing it, typically logout is handled purely client-side with Supabase.
    // For API consistency, returning success.
    return { success: true };
  }

  async getCurrentUser(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        phone: true,
        firstName: true,
        lastName: true,
        role: true,
        schoolId: true,
        createdAt: true,
        updatedAt: true,
        school: true,
      },
    });
  }
}
