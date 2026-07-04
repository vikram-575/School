import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('admin')
  async getAdminDashboard(@Request() req: any) {
    return this.dashboardService.getAdminStats(req.user.schoolId);
  }

  @Roles('SUPER_ADMIN')
  @UseGuards(RolesGuard)
  @Get('superadmin')
  async getSuperAdminDashboard() {
    return this.dashboardService.getSuperAdminStats();
  }

  @Get('accountant')
  async getAccountantDashboard(@Request() req: any) {
    return this.dashboardService.getAccountantStats(req.user.schoolId);
  }

  @Get('principal')
  async getPrincipalDashboard(@Request() req: any) {
    return this.dashboardService.getPrincipalStats(req.user.schoolId);
  }

  @Get('hr')
  async getHrDashboard(@Request() req: any) {
    return this.dashboardService.getHrStats(req.user.schoolId);
  }
}
