import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { AcademicsController } from './academics.controller';
import { AcademicsService } from './academics.service';
import { ExamsController } from './exams.controller';
import { ExamsService } from './exams.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [AcademicsController, ExamsController],
  providers: [AcademicsService, ExamsService],
})
export class AcademicsModule {}
