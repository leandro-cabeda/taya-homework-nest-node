
import { Controller, Get, Query } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('profit-by-status')
  @ApiOperation({ summary: 'Retorna a soma do profit de todas as propostas por usuario agrupada por status.' })
  @ApiResponse({ status: 200, description: 'Retorna todas proposas por status agrupado.' })
  async getProfitByStatus() {
    return this.adminService.getProfitByStatus();
  }

  @Get('best-users')
  @ApiOperation({ summary: 'Retorna os users que possuem o maior profit de propostas em sucesso vinculado.' })
  @ApiResponse({ status: 200, description: 'Retorna todos os usuarios que possuem mais profit de sucesso' })
  @ApiQuery({ name: 'start', required: true, type: String })
  @ApiQuery({ name: 'end', required: true, type: String })
  async getBestUsers(@Query('start') start: string, @Query('end') end: string) {
    return this.adminService.getBestUsers(start, end);
  }
}

