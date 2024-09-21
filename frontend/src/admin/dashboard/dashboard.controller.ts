import { Controller, Get, HttpCode, HttpStatus, Query, Req, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { UserGuard } from '../guard/user.guard';
import { UserEntity } from '../../database/entities/user.entity';
import { GetDashboardEmployeesDto } from './dto/get-dashboard-employees.dto';

@Controller('admin/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @UseGuards(UserGuard)
  @Get('summary')
  @HttpCode(HttpStatus.OK)
  getSummary(@Req() req: any) {
    const user = <UserEntity>req.user;
    return this.dashboardService.getSummary(user.id);
  }

  @UseGuards(UserGuard)
  @Get('get_dashboard_employees')
  @HttpCode(HttpStatus.OK)
  getDashboardEmployees(@Req() req: any, @Query() query: GetDashboardEmployeesDto) {
    const user = <UserEntity>req.user;
    return this.dashboardService.getDashboardEmployees(user.id, query);
  }
}
