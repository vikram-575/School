"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UsersService", {
    enumerable: true,
    get: function() {
        return UsersService;
    }
});
const _common = require("@nestjs/common");
const _prismaservice = require("../prisma/prisma.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
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
    studentProfile: true
};
let UsersService = class UsersService {
    findAll(user, roleName, requestedSchoolId) {
        const schoolId = user.role === 'SUPER_ADMIN' ? requestedSchoolId : user.schoolId ?? undefined;
        return this.prisma.user.findMany({
            where: {
                schoolId,
                role: roleName ? {
                    name: roleName
                } : undefined
            },
            select: userSelect,
            orderBy: {
                firstName: 'asc'
            }
        });
    }
    async create(user, data) {
        const schoolId = user.role === 'SUPER_ADMIN' ? data.schoolId : user.schoolId;
        if (data.role !== 'SUPER_ADMIN' && !schoolId) {
            throw new _common.ForbiddenException('schoolId is required for tenant users');
        }
        // Resolve Role
        let roleRecord = await this.prisma.role.findFirst({
            where: {
                name: data.role,
                schoolId: schoolId || ''
            }
        });
        if (!roleRecord) {
            // Fallback to system role
            roleRecord = await this.prisma.role.findFirst({
                where: {
                    name: data.role,
                    isSystem: true
                }
            });
        }
        if (!roleRecord) {
            throw new _common.ForbiddenException(`Role ${data.role} not found`);
        }
        const userData = {
            email: data.email,
            phone: data.phone,
            passwordHash: data.password ?? 'password123',
            firstName: data.firstName,
            lastName: data.lastName,
            role: {
                connect: {
                    id: roleRecord.id
                }
            },
            school: schoolId ? {
                connect: {
                    id: schoolId
                }
            } : undefined
        };
        // Profiles (Module 2)
        if (data.role === 'STUDENT' && data.admissionNumber) {
            userData.studentProfile = {
                create: {
                    schoolId: schoolId,
                    admissionNumber: data.admissionNumber
                }
            };
        } else if ([
            'TEACHER',
            'STAFF',
            'PRINCIPAL'
        ].includes(data.role) && data.employeeId) {
            userData.employeeProfile = {
                create: {
                    schoolId: schoolId,
                    employeeId: data.employeeId
                }
            };
        }
        return this.prisma.user.create({
            data: userData,
            select: userSelect
        });
    }
    async findOne(id, user) {
        const found = await this.prisma.user.findUnique({
            where: {
                id
            },
            select: userSelect
        });
        if (!found) throw new _common.NotFoundException('User not found');
        if (user.role !== 'SUPER_ADMIN' && found.schoolId !== user.schoolId) {
            throw new _common.ForbiddenException('Cannot access users outside your school');
        }
        return found;
    }
    constructor(prisma){
        this.prisma = prisma;
    }
};
UsersService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _prismaservice.PrismaService === "undefined" ? Object : _prismaservice.PrismaService
    ])
], UsersService);

//# sourceMappingURL=users.service.js.map