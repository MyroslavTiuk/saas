import { Controller, Get, HttpCode, HttpStatus, Query, Req, UseGuards } from '@nestjs/common';
import { GetDailyDto } from './dto/get-daily.dto';
import { UserEntity } from '../../database/entities/user.entity';
import { AttendanceService } from './attendance.service';
import { UserGuard } from '../guard/user.guard';
import { GetWeeklyDto } from './dto/get-weekly.dto';
import { GetMonthlyDto } from './dto/get-monthly.dto';
import { GetFortnightlyDto } from './dto/get-fortnightly.dto';

@Controller('admin/attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}
  @UseGuards(UserGuard)
  @Get('daily')
  @HttpCode(HttpStatus.OK)
  getAttendancesDaily(@Req() req: any, @Query() query: GetDailyDto) {
    const user = <UserEntity>req.user;
    return this.attendanceService.getAttendancesDaily(user.id, query);
  }

  @UseGuards(UserGuard)
  @Get('weekly')
  @HttpCode(HttpStatus.OK)
  getAttendancesWeekly(@Req() req: any, @Query() query: GetWeeklyDto) {
    const user = <UserEntity>req.user;
    return this.attendanceService.getAttendancesWeekly(user.id, query);
  }

  @UseGuards(UserGuard)
  @Get('monthly')
  @HttpCode(HttpStatus.OK)
  getAttendancesMonthly(@Req() req: any, @Query() query: GetMonthlyDto) {
    const user = <UserEntity>req.user;
    return this.attendanceService.getAttendancesMonthly(user.id, query);
  }

  @UseGuards(UserGuard)
  @Get('fortnightly')
  @HttpCode(HttpStatus.OK)
  getAttendancesFortnightly(@Req() req: any, @Query() query: GetFortnightlyDto) {
    const user = <UserEntity>req.user;
    return this.attendanceService.getAttendancesFortnightly(user.id, query);
  }
}
