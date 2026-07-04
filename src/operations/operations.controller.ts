import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, Request, Delete } from '@nestjs/common';
import { OperationsService } from './operations.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@Controller('operations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OperationsController {
  constructor(private readonly operationsService: OperationsService) {}

  // ==========================================
  // ATTENDANCE
  // ==========================================
  @Get('attendance')
  async getAttendance(
    @Request() req: any,
    @Query('date') date: string,
    @Query('sectionId') sectionId?: string,
  ) {
    return this.operationsService.getAttendance(req.user.schoolId, date, sectionId);
  }

  @Post('attendance')
  async markAttendance(@Request() req: any, @Body() data: any) {
    return this.operationsService.markAttendance(req.user.schoolId, data, req.user.id);
  }

  // ==========================================
  // LEAVES
  // ==========================================
  @Get('leaves')
  async getLeaves(@Request() req: any, @Query('status') status?: string) {
    return this.operationsService.getLeaveRequests(req.user.schoolId, status);
  }

  @Post('leaves')
  async applyLeave(@Request() req: any, @Body() data: any) {
    return this.operationsService.createLeaveRequest(req.user.schoolId, req.user.id, data);
  }

  @Patch('leaves/:id')
  async updateLeaveStatus(
    @Request() req: any,
    @Param('id') id: string,
    @Body() data: any,
  ) {
    return this.operationsService.updateLeaveRequest(req.user.schoolId, id, data, req.user.id);
  }

  // ==========================================
  // NOTICES
  // ==========================================
  @Get('notices')
  async getNotices(@Request() req: any) {
    return this.operationsService.getNotices(req.user.schoolId);
  }

  @Post('notices')
  async createNotice(@Request() req: any, @Body() data: any) {
    return this.operationsService.createNotice(req.user.schoolId, req.user.id, data);
  }

  @Delete('notices/:id')
  async deleteNotice(@Request() req: any, @Param('id') id: string) {
    return this.operationsService.deleteNotice(req.user.schoolId, id);
  }

  // ==========================================
  // TIMETABLE
  // ==========================================
  @Get('timetable/periods')
  async getPeriods(@Request() req: any) {
    return this.operationsService.getPeriods(req.user.schoolId);
  }

  @Post('timetable/periods')
  async createPeriod(@Request() req: any, @Body() data: any) {
    return this.operationsService.createPeriod(req.user.schoolId, data);
  }

  @Get('timetable')
  async getTimetable(
    @Request() req: any,
    @Query('sectionId') sectionId: string,
  ) {
    return this.operationsService.getTimetable(req.user.schoolId, sectionId);
  }

  @Post('timetable')
  async saveTimetableEntry(@Request() req: any, @Body() data: any) {
    return this.operationsService.saveTimetableEntry(req.user.schoolId, data);
  }
}
