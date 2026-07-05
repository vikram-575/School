import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { RequestUser } from '../common/tenant';
import { PrismaService } from '../prisma/prisma.service';

const userSelect = {
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
  employeeProfile: true,
  studentProfile: true,
} satisfies Prisma.UserSelect;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(user: RequestUser, roleName?: string, requestedSchoolId?: string) {
    const schoolId = user.role === 'SUPER_ADMIN' ? requestedSchoolId : user.schoolId ?? undefined;
    return this.prisma.user.findMany({
      where: { 
        schoolId, 
        role: roleName ? { name: roleName } : undefined 
      },
      select: userSelect,
      orderBy: { firstName: 'asc' },
    });
  }

  async create(
    user: RequestUser,
    data: {
      email?: string;
      phone?: string;
      password?: string;
      firstName: string;
      lastName: string;
      role: string;
      schoolId?: string;
      admissionNumber?: string;
      employeeId?: string;
    },
  ) {
    const schoolId = user.role === 'SUPER_ADMIN' ? data.schoolId : user.schoolId;
    if (data.role !== 'SUPER_ADMIN' && !schoolId) {
      throw new ForbiddenException('schoolId is required for tenant users');
    }

    // Resolve Role
    let roleRecord = await this.prisma.role.findFirst({ where: { name: data.role, schoolId: schoolId || '' } });
    if (!roleRecord) {
        // Fallback to system role
        roleRecord = await this.prisma.role.findFirst({ where: { name: data.role, isSystem: true } });
    }
    if (!roleRecord) {
        throw new ForbiddenException(`Role ${data.role} not found`);
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseAnonKey = process.env.SUPABASE_KEY;

    if (supabaseUrl && data.email && data.password) {
      const { createClient } = require('@supabase/supabase-js');
      
      if (supabaseServiceKey) {
        const supabase = createClient(supabaseUrl, supabaseServiceKey);
        const { error: authError } = await supabase.auth.admin.createUser({
          email: data.email,
          password: data.password,
          email_confirm: true,
          user_metadata: {
            firstName: data.firstName,
            lastName: data.lastName,
            role: data.role,
          },
        });
        if (authError) {
          throw new ForbiddenException(`Failed to create user in Supabase: ${authError.message}`);
        }
      } else if (supabaseAnonKey) {
        const supabase = createClient(supabaseUrl, supabaseAnonKey);
        const { error: authError } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            data: {
              firstName: data.firstName,
              lastName: data.lastName,
              role: data.role,
            }
          }
        });
        if (authError) {
          throw new ForbiddenException(`Failed to create user in Supabase: ${authError.message}`);
        }
      }
    }

    const userData: Prisma.UserCreateInput = {
      email: data.email,
      phone: data.phone,
      passwordHash: data.password ?? 'password123',
      firstName: data.firstName,
      lastName: data.lastName,
      role: { connect: { id: roleRecord.id } },
      school: schoolId ? { connect: { id: schoolId } } : undefined,
    };

    // Profiles (Module 2)
    if (data.role === 'STUDENT' && data.admissionNumber) {
      userData.studentProfile = {
        create: {
          schoolId: schoolId as string,
          admissionNumber: data.admissionNumber,
        }
      };
    } else if (['TEACHER', 'STAFF', 'PRINCIPAL'].includes(data.role) && data.employeeId) {
      userData.employeeProfile = {
        create: {
          schoolId: schoolId as string,
          employeeId: data.employeeId,
        }
      };
    }

    return this.prisma.user.create({
      data: userData,
      select: userSelect,
    });
  }

  async findOne(id: string, user: RequestUser) {
    const found = await this.prisma.user.findUnique({ where: { id }, select: userSelect });
    if (!found) throw new NotFoundException('User not found');
    if (user.role !== 'SUPER_ADMIN' && found.schoolId !== user.schoolId) {
      throw new ForbiddenException('Cannot access users outside your school');
    }
    return found;
  }
}
