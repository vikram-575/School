import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async getClassReport(schoolId: string, sectionId: string) {
    // This is a simplified report logic for now
    const section = await this.prisma.section.findUnique({
      where: { id: sectionId },
      include: {
        students: {
          include: {
            user: { select: { firstName: true, lastName: true, id: true } }
          }
        },
        class: true,
      }
    });

    if (!section) throw new Error("Section not found");
    const studentIds = section.students.map(s => s.id);

    // Fetch exam results for these students
    const results = await this.prisma.examResult.findMany({
      where: { studentId: { in: studentIds } },
      include: {
        exam: true,
        subject: true
      }
    });

    // We can aggregate data here if there are results
    return {
      section,
      results,
      message: "Class report generated successfully"
    };
  }

  async getStudentReport(schoolId: string, studentId: string) {
    // Find student
    const student = await this.prisma.studentProfile.findUnique({
      where: { id: studentId },
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
        currentSection: { include: { class: true } }
      }
    });

    if (!student) throw new Error("Student not found");

    // Fetch exam results for this student
    const results = await this.prisma.examResult.findMany({
      where: { studentId },
      include: {
        exam: true,
        subject: true
      }
    });

    return {
      student,
      results,
      message: "Student report generated successfully"
    };
  }
}
