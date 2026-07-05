import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { SchoolsModule } from './schools/schools.module';
import { AcademicsModule } from './academics/academics.module';
import { FinanceModule } from './finance/finance.module';
import { ChatModule } from './modules/chat/chat.module';
import { AuthModule } from './auth/auth.module';
import { TenantMiddleware } from './core/tenant.middleware';
import { OperationsModule } from './operations/operations.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [AuthModule, UsersModule, SchoolsModule, AcademicsModule, FinanceModule, ChatModule, OperationsModule, DashboardModule, ReportsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TenantMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
