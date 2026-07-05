import { Controller, Get, Param, Post, Put, Body, Req, UseGuards, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AcademicsService } from './academics.service';

@UseGuards(JwtAuthGuard)
@Controller('academics')
export class AcademicsController {
  constructor(private readonly academicsService: AcademicsService) {}

  @Get('years')
  getAcademicYears(@Req() req: any) {
    return this.academicsService.getAcademicYears(req.user.schoolId);
  }

  @Post('years')
  createAcademicYear(@Req() req: any, @Body() body: any) {
    return this.academicsService.createAcademicYear(req.user.schoolId, body);
  }

  @Get('departments')
  getDepartments(@Req() req: any) {
    return this.academicsService.getDepartments(req.user.schoolId);
  }

  @Post('departments')
  createDepartment(@Req() req: any, @Body() body: any) {
    return this.academicsService.createDepartment(req.user.schoolId, body);
  }

  @Get('classes')
  getClasses(@Req() req: any) {
    return this.academicsService.getClasses(req.user.schoolId);
  }

  @Post('classes')
  createClass(@Req() req: any, @Body() body: any) {
    return this.academicsService.createClass(req.user.schoolId, body);
  }

  @Get('sections')
  getSections(@Req() req: any, @Query('classId') classId?: string) {
    return this.academicsService.getSections(req.user.schoolId, classId);
  }

  @Post('sections')
  createSection(@Req() req: any, @Body() body: any) {
    return this.academicsService.createSection(req.user.schoolId, body);
  }

  @Get('subjects')
  getSubjects(@Req() req: any) {
    return this.academicsService.getSubjects(req.user.schoolId);
  }

  @Post('subjects')
  createSubject(@Req() req: any, @Body() body: any) {
    return this.academicsService.createSubject(req.user.schoolId, body);
  }

  @Put('sections/:id/class-teacher')
  assignClassTeacher(@Param('id') sectionId: string, @Req() req: any, @Body() body: { teacherId: string }) {
    return this.academicsService.assignClassTeacher(req.user.schoolId, sectionId, body.teacherId);
  }

  @Put('class-subjects/:id/teacher')
  assignSubjectTeacher(@Param('id') classSubjectId: string, @Req() req: any, @Body() body: { teacherId: string }) {
    return this.academicsService.assignSubjectTeacher(req.user.schoolId, classSubjectId, body.teacherId);
  }
}
