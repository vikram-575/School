import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { AuthenticatedRequest } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(@Req() request: AuthenticatedRequest, @Query('role') role?: string, @Query('schoolId') schoolId?: string, @Query('sectionId') sectionId?: string) {
    return this.usersService.findAll(request.user, role, schoolId, sectionId);
  }

  @Post()
  create(
    @Req() request: AuthenticatedRequest,
    @Body()
    body: {
      email?: string;
      phone?: string;
      password?: string;
      firstName: string;
      lastName: string;
      role: string;
      schoolId?: string;
      admissionNumber?: string;
      employeeId?: string;
    },
  ) {
    return this.usersService.create(request.user, body);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() request: AuthenticatedRequest) {
    return this.usersService.findOne(id, request.user);
  }

  @Put(':id')
  update(@Param('id') id: string, @Req() request: AuthenticatedRequest, @Body() body: any) {
    return this.usersService.update(id, request.user, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() request: AuthenticatedRequest) {
    return this.usersService.remove(id, request.user);
  }
}
