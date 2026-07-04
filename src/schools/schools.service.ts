import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RequestUser } from '../common/tenant';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class SchoolsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.school.findMany({
      orderBy: { createdAt: 'desc' },
      include: { subscriptions: { orderBy: { createdAt: 'desc' }, take: 1 } },
    });
  }

  async create(data: any) {
    try {
      console.log('SchoolsService.create called with data:', data);
      return await this.prisma.$transaction(async (tx) => {
        // 1. Create School
        const school = await tx.school.create({
          data: {
            name: data.name,
            contactEmail: data.contactEmail,
            subdomain: data.subdomain,
            registrationCode: data.registrationCode,
            address: data.address,
            contactPhone: data.contactPhone,
            status: data.isActive !== false ? 'ACTIVE' : 'INACTIVE',
          },
        });

        console.log('Created school in DB:', school.id);

        // 2. Create initial School Admin User if credentials provided
        if (data.adminEmail && data.adminPassword) {
          // Assume SCHOOL_ADMIN role exists or gets created
          let role = await tx.role.findFirst({ where: { name: 'SCHOOL_ADMIN' } });
          if (!role) {
            role = await tx.role.create({
              data: { name: 'SCHOOL_ADMIN', description: 'School Admin', isSystem: true, schoolId: school.id }
            });
            console.log('Created SCHOOL_ADMIN role');
          }

          const supabaseUrl = process.env.SUPABASE_URL;
          const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
          const supabaseAnonKey = process.env.SUPABASE_KEY;
          
          if (supabaseUrl) {
            if (supabaseServiceKey) {
              const supabase = createClient(supabaseUrl, supabaseServiceKey);
              const { error: authError } = await supabase.auth.admin.createUser({
                email: data.adminEmail,
                password: data.adminPassword,
                email_confirm: true,
                user_metadata: {
                  firstName: data.adminFirstName || 'Admin',
                  lastName: data.adminLastName || '',
                  role: 'SCHOOL_ADMIN',
                },
              });
              if (authError) throw new Error(`Failed to create admin in Supabase: ${authError.message}`);
              console.log('Created admin via admin api');
            } else if (supabaseAnonKey) {
              const supabase = createClient(supabaseUrl, supabaseAnonKey);
              const { error: authError } = await supabase.auth.signUp({
                email: data.adminEmail,
                password: data.adminPassword,
                options: {
                  data: {
                    firstName: data.adminFirstName || 'Admin',
                    lastName: data.adminLastName || '',
                    role: 'SCHOOL_ADMIN',
                  }
                }
              });
              if (authError) throw new Error(`Failed to create admin in Supabase: ${authError.message}`);
              console.log('Created admin via signup api');
            }
          }
          
          await tx.user.create({
            data: {
              email: data.adminEmail,
              passwordHash: data.adminPassword, // Note: Prototype uses plain text auth
              firstName: data.adminFirstName || 'Admin',
              lastName: data.adminLastName || '',
              roleId: role.id,
              schoolId: school.id,
            },
          });
          console.log('Created user in Prisma');
        }

        return school;
      });
    } catch (error) {
      console.error('SchoolsService.create error:', error);
      throw error;
    }
  }

  findOne(id: string) {
    return this.prisma.school.findUnique({
      where: { id },
      include: {
        subscriptions: true,
      },
    });
  }

  update(id: string, data: Partial<{ name: string; contactEmail: string; subdomain: string; address: string; contactPhone: string; isActive: boolean }>) {
    const updateData: any = { ...data };
    if (data.isActive !== undefined) {
      updateData.status = data.isActive ? 'ACTIVE' : 'INACTIVE';
      delete updateData.isActive;
    }
    return this.prisma.school.update({
      where: { id },
      data: updateData,
    });
  }

  remove(id: string) {
    return this.prisma.school.delete({
      where: { id },
    });
  }

  async updateSubscription(schoolId: string, data: any) {
    const existing = await this.prisma.subscription.findFirst({ where: { schoolId } });
    
    // We need to fetch plan by name
    const plan = await this.prisma.plan.findUnique({ where: { name: data.planName } });
    if (!plan) throw new Error('Plan not found');

    if (existing) {
      return this.prisma.subscription.update({
        where: { id: existing.id },
        data: {
          planId: plan.id,
          status: data.status,
          validFrom: new Date(),
          validUntil: new Date(data.validUntil)
        }
      });
    } else {
      return this.prisma.subscription.create({
        data: {
          schoolId,
          planId: plan.id,
          status: data.status,
          validFrom: new Date(),
          validUntil: new Date(data.validUntil)
        }
      });
    }
  }

  async dashboard(id: string, user: RequestUser) {
    // Simplified dashboard for Module 1 since students/teachers/fees/events are not in the schema yet.
    const schoolId = user.role === 'SUPER_ADMIN' ? id : user.schoolId ?? id;
    
    return {
      schoolId,
      totals: {
        students: 0,
        teachers: 0,
        staff: 0,
        pendingFees: 0,
        collectedAmount: 0,
      },
      events: [],
    };
  }
}
