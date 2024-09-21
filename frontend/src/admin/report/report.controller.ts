import { Controller, Get, Query, Req, Res, UseGuards } from '@nestjs/common';
import { UserGuard } from '../guard/user.guard';
import { ReportDailyDto } from './dto/report-daily.dto';
import { UserEntity } from '../../database/entities/user.entity';
import { ReportWeeklyDto } from './dto/report-weekly.dto';
import { ReportFortnightlyDto } from './dto/report-fortnightly.dto';
import { ReportMonthlyDto } from './dto/report-monthly.dto';
import { ReportService } from './report.service';
import { ReportEmployeeDailyDto } from './dto/report-employee-daily.dto';
import { ReportEmployeeWeeklyDto } from './dto/report-employee-weekly.dto';
import { ReportEmployeeMonthlyDto } from './dto/report-employee-monthly.dto';
import { ReportEmployeeFortnightlyDto } from './dto/report-employee-fortnightly.dto';

@Controller('admin/report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}
  @UseGuards(UserGuard)
  @Get('print_daily')
  printDaily(@Req() req: any, @Query() query: ReportDailyDto, @Res() res: Response) {
    const user = <UserEntity>req.user;
    return this.reportService.printDaily(user.id, query, res);
  }

  @UseGuards(UserGuard)
  @Get('print_weekly')
  printWeekly(@Req() req: any, @Query() query: ReportWeeklyDto, @Res() res: Response) {
    const user = <UserEntity>req.user;
    return this.reportService.printWeekly(user.id, query, res);
  }

  @UseGuards(UserGuard)
  @Get('print_fortnightly')
  printFortnightly(@Req() req: any, @Query() query: ReportFortnightlyDto, @Res() res: Response) {
    const user = <UserEntity>req.user;
    return this.reportService.printFortnightly(user.id, query, res);
  }

  @UseGuards(UserGuard)
  @Get('print_monthly')
  printMonthly(@Req() req: any, @Query() query: ReportMonthlyDto, @Res() res: Response) {
    const user = <UserEntity>req.user;
    return this.reportService.printMonthly(user.id, query, res);
  }

  //----------------------REPORT EMPLOYEE---------------------------
  @UseGuards(UserGuard)
  @Get('employee/print_daily')
  printEmployeeDaily(
    @Req() req: any,
    @Query() query: ReportEmployeeDailyDto,
    @Res() res: Response,
  ) {
    const user = <UserEntity>req.user;
    return this.reportService.printEmployeeDaily(user.id, query, res);
  }

  @UseGuards(UserGuard)
  @Get('employee/print_weekly')
  printEmployeeWeekly(
    @Req() req: any,
    @Query() query: ReportEmployeeWeeklyDto,
    @Res() res: Response,
  ) {
    const user = <UserEntity>req.user;
    return this.reportService.printEmployeeWeekly(user.id, query, res);
  }

  @UseGuards(UserGuard)
  @Get('employee/print_monthly')
  printEmployeeMonthly(
    @Req() req: any,
    @Query() query: ReportEmployeeMonthlyDto,
    @Res() res: Response,
  ) {
    const user = <UserEntity>req.user;
    return this.reportService.printEmployeeMonthly(user.id, query, res);
  }

  @UseGuards(UserGuard)
  @Get('employee/print_fortnightly')
  printEmployeeFortnightly(
    @Req() req: any,
    @Query() query: ReportEmployeeFortnightlyDto,
    @Res() res: Response,
  ) {
    const user = <UserEntity>req.user;
    return this.reportService.printEmployeeFortnightly(user.id, query, res);
  }
}
