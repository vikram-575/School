import { Controller, Get, Put, Body, UseGuards, Request } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@Controller('operations/settings')
@UseGuards(JwtAuthGuard)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  getSettings(@Request() req: any) {
    const schoolId = req.user.schoolId || 'SUPER_ADMIN_DEFAULT';
    return this.settingsService.getSettings(schoolId);
  }

  @Put()
  updateSettings(@Request() req: any, @Body() body: any) {
    const schoolId = req.user.schoolId || 'SUPER_ADMIN_DEFAULT';
    return this.settingsService.updateSettings(schoolId, body, req.user.id);
  }
}
