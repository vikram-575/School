"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
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
};
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAll(user, roleName, requestedSchoolId, sectionId) {
        const schoolId = user.role === 'SUPER_ADMIN' ? requestedSchoolId : user.schoolId ?? undefined;
        const whereClause = {
            schoolId,
            role: roleName ? { name: roleName } : undefined
        };
        if (sectionId && roleName === 'STUDENT') {
            whereClause.studentProfile = {
                currentSectionId: sectionId
            };
        }
        return this.prisma.user.findMany({
            where: whereClause,
            select: userSelect,
            orderBy: { firstName: 'asc' },
        });
    }
    async create(user, data) {
        const schoolId = user.role === 'SUPER_ADMIN' ? data.schoolId : user.schoolId;
        if (data.role !== 'SUPER_ADMIN' && !schoolId) {
            throw new common_1.ForbiddenException('schoolId is required for tenant users');
        }
        let roleRecord = await this.prisma.role.findFirst({ where: { name: data.role, schoolId: schoolId || '' } });
        if (!roleRecord) {
            roleRecord = await this.prisma.role.findFirst({ where: { name: data.role, isSystem: true } });
        }
        if (!roleRecord) {
            throw new common_1.ForbiddenException(`Role ${data.role} not found`);
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
                    throw new common_1.ForbiddenException(`Failed to create user in Supabase: ${authError.message}`);
                }
            }
            else if (supabaseAnonKey) {
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
                    throw new common_1.ForbiddenException(`Failed to create user in Supabase: ${authError.message}`);
                }
            }
        }
        const userData = {
            email: data.email,
            phone: data.phone,
            passwordHash: data.password ?? 'password123',
            firstName: data.firstName,
            lastName: data.lastName,
            role: { connect: { id: roleRecord.id } },
            school: schoolId ? { connect: { id: schoolId } } : undefined,
        };
        if (data.role === 'STUDENT' && data.admissionNumber) {
            userData.studentProfile = {
                create: {
                    schoolId: schoolId,
                    admissionNumber: data.admissionNumber,
                }
            };
        }
        else if (['TEACHER', 'STAFF', 'PRINCIPAL'].includes(data.role) && data.employeeId) {
            userData.employeeProfile = {
                create: {
                    schoolId: schoolId,
                    employeeId: data.employeeId,
                }
            };
        }
        return this.prisma.user.create({
            data: userData,
            select: userSelect,
        });
    }
    async findOne(id, user) {
        const found = await this.prisma.user.findUnique({ where: { id }, select: userSelect });
        if (!found)
            throw new common_1.NotFoundException('User not found');
        if (user.role !== 'SUPER_ADMIN' && found.schoolId !== user.schoolId) {
            throw new common_1.ForbiddenException('Cannot access users outside your school');
        }
        return found;
    }
    async update(id, user, data) {
        const found = await this.prisma.user.findUnique({ where: { id } });
        if (!found)
            throw new common_1.NotFoundException('User not found');
        if (user.role !== 'SUPER_ADMIN' && found.schoolId !== user.schoolId) {
            throw new common_1.ForbiddenException('Cannot modify users outside your school');
        }
        const updateData = {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone,
        };
        if (data.role) {
            const roleRecord = await this.prisma.role.findFirst({ where: { name: data.role, schoolId: found.schoolId || '' } }) ||
                await this.prisma.role.findFirst({ where: { name: data.role, isSystem: true } });
            if (roleRecord) {
                updateData.role = { connect: { id: roleRecord.id } };
            }
        }
        if (found.roleId) {
            const role = await this.prisma.role.findUnique({ where: { id: found.roleId } });
            if (role?.name === 'STUDENT' && data.admissionNumber) {
                updateData.studentProfile = {
                    upsert: {
                        create: { schoolId: found.schoolId, admissionNumber: data.admissionNumber },
                        update: { admissionNumber: data.admissionNumber }
                    }
                };
            }
            else if (role && ['TEACHER', 'STAFF', 'PRINCIPAL'].includes(role.name) && data.employeeId) {
                updateData.employeeProfile = {
                    upsert: {
                        create: { schoolId: found.schoolId, employeeId: data.employeeId },
                        update: { employeeId: data.employeeId }
                    }
                };
            }
        }
        return this.prisma.user.update({
            where: { id },
            data: updateData,
            select: userSelect,
        });
    }
    async remove(id, user) {
        const found = await this.prisma.user.findUnique({ where: { id } });
        if (!found)
            throw new common_1.NotFoundException('User not found');
        if (user.role !== 'SUPER_ADMIN' && found.schoolId !== user.schoolId) {
            throw new common_1.ForbiddenException('Cannot delete users outside your school');
        }
        if (found.email) {
            const supabaseUrl = process.env.SUPABASE_URL;
            const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
            if (supabaseUrl && supabaseServiceKey) {
                const { createClient } = require('@supabase/supabase-js');
                const supabase = createClient(supabaseUrl, supabaseServiceKey);
                const { data: usersData } = await supabase.auth.admin.listUsers();
                const sbUser = usersData?.users?.find((u) => u.email === found.email);
                if (sbUser) {
                    await supabase.auth.admin.deleteUser(sbUser.id);
                }
            }
        }
        await this.prisma.employeeProfile.deleteMany({ where: { userId: id } });
        await this.prisma.studentProfile.deleteMany({ where: { userId: id } });
        return this.prisma.user.delete({
            where: { id },
        });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map