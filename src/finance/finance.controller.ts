import { Controller, Get, Post, Body, Req, Request, UseGuards, Query, Param } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FinanceService } from './finance.service';

@UseGuards(JwtAuthGuard)
@Controller('finance')
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Get('categories')
  async getCategories(@Request() req: any) {
    return this.financeService.getCategories(req.user.schoolId);
  }

  @Post('categories')
  async createCategory(@Request() req: any, @Body() data: any) {
    return this.financeService.createCategory(req.user.schoolId, data);
  }

  @Get('structures')
  async getStructures(@Request() req: any) {
    return this.financeService.getStructures(req.user.schoolId);
  }

  @Post('structures')
  async createStructure(@Request() req: any, @Body() data: any) {
    return this.financeService.createStructure(req.user.schoolId, data);
  }

  @Get('invoices')
  async getInvoices(@Request() req: any, @Query('status') status?: string) {
    return this.financeService.getInvoices(req.user.schoolId, status);
  }

  @Post('invoices')
  async createInvoice(@Request() req: any, @Body() data: any) {
    return this.financeService.createInvoice(req.user.schoolId, data);
  }

  @Post('invoices/:id/pay')
  async recordPayment(@Request() req: any, @Param('id') id: string, @Body() data: any) {
    return this.financeService.recordPayment(req.user.schoolId, id, data);
  }
}
