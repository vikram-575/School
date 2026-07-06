import { SettingsService } from './settings.service';
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    getSettings(req: any): Promise<any>;
    updateSettings(req: any, body: any): Promise<{
        id: string;
        schoolId: string | null;
        key: string;
        value: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        createdBy: string | null;
        updatedBy: string | null;
    }>;
}
