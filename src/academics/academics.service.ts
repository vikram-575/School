import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RequestUser } from '../common/tenant';

@Injectable()
export class AcademicsService {
  constructor(private readonly prisma: PrismaService) {}

  // =====================================
  // ACADEMIC YEAR
  // =====================================
  async getAcademicYears(schoolId: string) {
    return this.prisma.academicYear.findMany({ where: { schoolId }, orderBy: { startDate: 'desc' } });
  }

  async createAcademicYear(schoolId: string, data: any) {
    return this.prisma.academicYear.create({
      data: { ...data, schoolId },
    });
  }

  // =====================================
  // DEPARTMENT
  // =====================================
  async getDepartments(schoolId: string) {
    return this.prisma.department.findMany({ where: { schoolId } });
  }

  async createDepartment(schoolId: string, data: any) {
    return this.prisma.department.create({
      data: { ...data, schoolId },
    });
  }

  // =====================================
  // CLASSES
  // =====================================
  async getClasses(schoolId: string) {
    return this.prisma.class.findMany({ 
      where: { schoolId },
      include: { sections: true },
      orderBy: { order: 'asc' } 
    });
  }

  async createClass(schoolId: string, data: any) {
    return this.prisma.class.create({
      data: { ...data, schoolId },
    });
  }

  // =====================================
  // SECTIONS
  // =====================================
  async getSections(schoolId: string, classId?: string) {
    const where: any = { schoolId };
    if (classId) where.classId = classId;
    return this.prisma.section.findMany({ 
      where, 
      include: { class: true },
      orderBy: { name: 'asc' }
    });
  }

  async createSection(schoolId: string, data: any) {
    return this.prisma.section.create({
      data: { ...data, schoolId },
    });
  }

  // =====================================
  // SUBJECTS
  // =====================================
  async getSubjects(schoolId: string) {
    return this.prisma.subject.findMany({ where: { schoolId }, orderBy: { name: 'asc' } });
  }

  async createSubject(schoolId: string, data: any) {
    return this.prisma.subject.create({
      data: {
        schoolId,
        name: data.name,
        code: data.code,
        type: data.type || "THEORY",
      }
    });
  }

  async assignClassTeacher(schoolId: string, sectionId: string, employeeId: string) {
    // Find internal employeeProfile id using employeeId
    const employee = await this.prisma.employeeProfile.findFirst({
      where: { schoolId, employeeId }
    });
    if (!employee) throw new Error('Employee not found');

    return this.prisma.section.update({
      where: { id: sectionId },
      data: { classTeacherId: employee.id }
    });
  }

  async assignSubjectTeacher(schoolId: string, classSubjectId: string, employeeId: string) {
    const employee = await this.prisma.employeeProfile.findFirst({
      where: { schoolId, employeeId }
    });
    if (!employee) throw new Error('Employee not found');

    return this.prisma.classSubject.update({
      where: { id: classSubjectId },
      data: { teacherId: employee.id }
    });
  }
}
