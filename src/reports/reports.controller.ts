import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ReportsService } from './reports.service';

@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('class/:sectionId')
  getClassReport(@Param('sectionId') sectionId: string, @Req() req: any) {
    return this.reportsService.getClassReport(req.user.schoolId, sectionId);
  }

  @Get('student/:studentId')
  getStudentReport(@Param('studentId') studentId: string, @Req() req: any) {
    return this.reportsService.getStudentReport(req.user.schoolId, studentId);
  }
}
