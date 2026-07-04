import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ExamsService {
  constructor(private prisma: PrismaService) {}

  async getExams(schoolId: string) {
    return this.prisma.exam.findMany({
      where: { schoolId },
      orderBy: { startDate: 'desc' },
    });
  }

  async createExam(schoolId: string, data: any) {
    return this.prisma.exam.create({
      data: {
        schoolId,
        name: data.name,
        description: data.description,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
      },
    });
  }

  async getExamResults(schoolId: string, examId: string, sectionId?: string) {
    return this.prisma.examResult.findMany({
      where: {
        schoolId,
        examId,
        ...(sectionId ? { student: { currentSectionId: sectionId } } : {}),
      },
      include: {
        student: {
          include: { user: true }
        },
        subject: true,
      },
    });
  }

  async saveExamResult(schoolId: string, data: any) {
    return this.prisma.examResult.upsert({
      where: {
        examId_studentId_subjectId_schoolId: {
          schoolId,
          examId: data.examId,
          studentId: data.studentId,
          subjectId: data.subjectId,
        },
      },
      update: {
        marksObtained: parseFloat(data.marksObtained),
        maxMarks: parseFloat(data.maxMarks),
        grade: data.grade,
        remarks: data.remarks,
      },
      create: {
        schoolId,
        examId: data.examId,
        studentId: data.studentId,
        subjectId: data.subjectId,
        marksObtained: parseFloat(data.marksObtained),
        maxMarks: parseFloat(data.maxMarks),
        grade: data.grade,
        remarks: data.remarks,
      },
    });
  }
}
