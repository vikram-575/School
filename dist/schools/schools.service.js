"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SchoolsService", {
    enumerable: true,
    get: function() {
        return SchoolsService;
    }
});
const _common = require("@nestjs/common");
const _prismaservice = require("../prisma/prisma.service");
const _supabasejs = require("@supabase/supabase-js");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let SchoolsService = class SchoolsService {
    findAll() {
        return this.prisma.school.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                subscriptions: {
                    orderBy: {
                        createdAt: 'desc'
                    },
                    take: 1
                }
            }
        });
    }
    async create(data) {
        try {
            console.log('SchoolsService.create called with data:', data);
            return await this.prisma.$transaction(async (tx)=>{
                // 1. Create School
                const school = await tx.school.create({
                    data: {
                        name: data.name,
                        contactEmail: data.contactEmail,
                        subdomain: data.subdomain,
                        registrationCode: data.registrationCode,
                        address: data.address,
                        contactPhone: data.contactPhone,
                        status: data.isActive !== false ? 'ACTIVE' : 'INACTIVE'
                    }
                });
                console.log('Created school in DB:', school.id);
                // 2. Create initial School Admin User if credentials provided
                if (data.adminEmail && data.adminPassword) {
                    // Assume SCHOOL_ADMIN role exists or gets created
                    let role = await tx.role.findFirst({
                        where: {
                            name: 'SCHOOL_ADMIN'
                        }
                    });
                    if (!role) {
                        role = await tx.role.create({
                            data: {
                                name: 'SCHOOL_ADMIN',
                                description: 'School Admin',
                                isSystem: true,
                                schoolId: school.id
                            }
                        });
                        console.log('Created SCHOOL_ADMIN role');
                    }
                    const supabaseUrl = process.env.SUPABASE_URL;
                    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
                    const supabaseAnonKey = process.env.SUPABASE_KEY;
                    if (supabaseUrl) {
                        if (supabaseServiceKey) {
                            const supabase = (0, _supabasejs.createClient)(supabaseUrl, supabaseServiceKey);
                            const { error: authError } = await supabase.auth.admin.createUser({
                                email: data.adminEmail,
                                password: data.adminPassword,
                                email_confirm: true,
                                user_metadata: {
                                    firstName: data.adminFirstName || 'Admin',
                                    lastName: data.adminLastName || '',
                                    role: 'SCHOOL_ADMIN'
                                }
                            });
                            if (authError) throw new Error(`Failed to create admin in Supabase: ${authError.message}`);
                            console.log('Created admin via admin api');
                        } else if (supabaseAnonKey) {
                            const supabase = (0, _supabasejs.createClient)(supabaseUrl, supabaseAnonKey);
                            const { error: authError } = await supabase.auth.signUp({
                                email: data.adminEmail,
                                password: data.adminPassword,
                                options: {
                                    data: {
                                        firstName: data.adminFirstName || 'Admin',
                                        lastName: data.adminLastName || '',
                                        role: 'SCHOOL_ADMIN'
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
                            passwordHash: data.adminPassword,
                            firstName: data.adminFirstName || 'Admin',
                            lastName: data.adminLastName || '',
                            roleId: role.id,
                            schoolId: school.id
                        }
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
    findOne(id) {
        return this.prisma.school.findUnique({
            where: {
                id
            },
            include: {
                subscriptions: true
            }
        });
    }
    update(id, data) {
        const updateData = {
            ...data
        };
        if (data.isActive !== undefined) {
            updateData.status = data.isActive ? 'ACTIVE' : 'INACTIVE';
            delete updateData.isActive;
        }
        return this.prisma.school.update({
            where: {
                id
            },
            data: updateData
        });
    }
    remove(id) {
        return this.prisma.school.delete({
            where: {
                id
            }
        });
    }
    async updateSubscription(schoolId, data) {
        const existing = await this.prisma.subscription.findFirst({
            where: {
                schoolId
            }
        });
        // We need to fetch plan by name
        const plan = await this.prisma.plan.findUnique({
            where: {
                name: data.planName
            }
        });
        if (!plan) throw new Error('Plan not found');
        if (existing) {
            return this.prisma.subscription.update({
                where: {
                    id: existing.id
                },
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
    async dashboard(id, user) {
        // Simplified dashboard for Module 1 since students/teachers/fees/events are not in the schema yet.
        const schoolId = user.role === 'SUPER_ADMIN' ? id : user.schoolId ?? id;
        return {
            schoolId,
            totals: {
                students: 0,
                teachers: 0,
                staff: 0,
                pendingFees: 0,
                collectedAmount: 0
            },
            events: []
        };
    }
    constructor(prisma){
        this.prisma = prisma;
    }
};
SchoolsService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _prismaservice.PrismaService === "undefined" ? Object : _prismaservice.PrismaService
    ])
], SchoolsService);

//# sourceMappingURL=schools.service.js.map