import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async getSettings(schoolId: string) {
    const rawSettings = await this.prisma.systemSetting.findMany({
      where: { schoolId },
    });

    // Default settings schema
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

    // Convert from DB rows to JSON object
    try {
      const parsedSettings = JSON.parse(rawSettings[0].value);
      return { ...defaultSettings, ...parsedSettings };
    } catch (e) {
      return defaultSettings;
    }
  }

  async updateSettings(schoolId: string, settingsData: any, userId: string) {
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
    } else {
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
}
