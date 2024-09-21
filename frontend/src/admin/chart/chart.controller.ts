import { Controller, Get, HttpCode, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { ManagerGuard } from '../guard/manager.guard';
import { ChartDailyDto } from './dto/chart-daily.dto';
import { ChartService } from './chart.service';
import { ChartWeeklyDto } from './dto/chart-weekly.dto';
import { ChartMonthlyDto } from './dto/chart-monthly.dto';
import { UserGuard } from '../guard/user.guard';

@Controller('admin/chart')
export class ChartController {
  constructor(private readonly chartService: ChartService) {}
  // @UseGuards(ManagerGuard)
  @Get('manager_chart_daily')
  @HttpCode(HttpStatus.OK)
  getManagerChartDaily(@Query() query: ChartDailyDto) {
    return this.chartService.getManagerChartDaily(query);
  }

  @UseGuards(ManagerGuard)
  @Get('manager_chart_weekly')
  @HttpCode(HttpStatus.OK)
  getManagerChartWeekly(@Query() query: ChartWeeklyDto) {
    return this.chartService.getManagerChartWeekly(query);
  }

  @UseGuards(ManagerGuard)
  @Get('manager_chart_monthly')
  @HttpCode(HttpStatus.OK)
  getManagerChartMonthly(@Query() query: ChartMonthlyDto) {
    return this.chartService.getManagerChartMonthly(query);
  }

  @UseGuards(ManagerGuard)
  @Get('manager_chart_fortnightly')
  @HttpCode(HttpStatus.OK)
  getManagerChartFortnightly() {
    return this.chartService.getManagerChartFortnightly();
  }

  @UseGuards(UserGuard)
  @Get('non_teacher_chart_daily')
  @HttpCode(HttpStatus.OK)
  getNonTeacherChartDaily(@Query() query: ChartDailyDto) {
    return this.chartService.getNonTeacherChartDaily(query);
  }

  @UseGuards(UserGuard)
  @Get('non_teacher_chart_weekly')
  @HttpCode(HttpStatus.OK)
  getNonTeacherChartWeekly(@Query() query: ChartWeeklyDto) {
    return this.chartService.getNonTeacherChartWeekly(query);
  }

  @UseGuards(UserGuard)
  @Get('non_teacher_chart_monthly')
  @HttpCode(HttpStatus.OK)
  getNonTeacherChartMonthly(@Query() query: ChartMonthlyDto) {
    return this.chartService.getNonTeacherChartMonthly(query);
  }

  @UseGuards(UserGuard)
  @Get('non_teacher_chart_fortnightly')
  @HttpCode(HttpStatus.OK)
  getNonTeacherChartFortnightly() {
    return this.chartService.getNonTeacherChartFortnightly();
  }

  @UseGuards(UserGuard)
  @Get('teacher_chart_daily')
  @HttpCode(HttpStatus.OK)
  getTeacherChartDaily(@Query() query: ChartDailyDto) {
    return this.chartService.getTeacherChartDaily(query);
  }

  @UseGuards(UserGuard)
  @Get('teacher_chart_weekly')
  @HttpCode(HttpStatus.OK)
  getTeacherChartWeekly(@Query() query: ChartWeeklyDto) {
    return this.chartService.getTeacherChartWeekly(query);
  }

  @UseGuards(UserGuard)
  @Get('teacher_chart_monthly')
  @HttpCode(HttpStatus.OK)
  getTeacherChartMonthly(@Query() query: ChartMonthlyDto) {
    return this.chartService.getTeacherChartMonthly(query);
  }

  @UseGuards(UserGuard)
  @Get('teacher_chart_fortnightly')
  @HttpCode(HttpStatus.OK)
  getTeacherChartFortnightly() {
    return this.chartService.getTeacherChartFortnightly();
  }
}
