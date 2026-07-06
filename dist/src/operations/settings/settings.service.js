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
exports.SettingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let SettingsService = class SettingsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getSettings(schoolId) {
        const rawSettings = await this.prisma.systemSetting.findMany({
            where: { schoolId },
        });
        const defaultSettings = {
            general: {
                schoolName: '',
                address: '',
                contactEmail: '',
                contactPhone: '',
            },
            academic: {
                currentYear: '2026-2027',
                gradingSystem: 'GPA_4',
                termStructure: 'SEMESTER',
            },
            notifications: {
                emailAlerts: true,
                smsAlerts: false,
                dailyDigest: true,
            }
        };
        if (!rawSettings || rawSettings.length === 0) {
            return defaultSettings;
        }
        try {
            const parsedSettings = JSON.parse(rawSettings[0].value);
            return { ...defaultSettings, ...parsedSettings };
        }
        catch (e) {
            return defaultSettings;
        }
    }
    async updateSettings(schoolId, settingsData, userId) {
        const existing = await this.prisma.systemSetting.findFirst({
            where: { schoolId, key: 'global_config' }
        });
        if (existing) {
            return this.prisma.systemSetting.update({
                where: { id: existing.id },
                data: {
                    value: JSON.stringify(settingsData),
                    updatedBy: userId,
                }
            });
        }
        else {
            return this.prisma.systemSetting.create({
                data: {
                    schoolId,
                    key: 'global_config',
                    value: JSON.stringify(settingsData),
                    createdBy: userId,
                }
            });
        }
    }
};
exports.SettingsService = SettingsService;
exports.SettingsService = SettingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SettingsService);
//# sourceMappingURL=settings.service.js.map