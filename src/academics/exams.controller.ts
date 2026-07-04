import { Controller, Get, Post, Body, Req, UseGuards, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ExamsService } from './exams.service';

@UseGuards(JwtAuthGuard)
@Controller('exams')
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @Get()
  getExams(@Req() req: any) {
    return this.examsService.getExams(req.user.schoolId);
  }

  @Post()
  createExam(@Req() req: any, @Body() body: any) {
    return this.examsService.createExam(req.user.schoolId, body);
  }

  @Get('results')
  getExamResults(
    @Req() req: any,
    @Query('examId') examId: string,
    @Query('sectionId') sectionId?: string,
  ) {
    return this.examsService.getExamResults(req.user.schoolId, examId, sectionId);
  }

  @Post('results')
  saveExamResult(@Req() req: any, @Body() body: any) {
    return this.examsService.saveExamResult(req.user.schoolId, body);
  }
}
