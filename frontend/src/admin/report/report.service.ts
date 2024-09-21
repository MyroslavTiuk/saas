import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../database/entities/user.entity';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { UserDetailEntity } from '../../database/entities/user-detail.entity';
import { PayloadEntity } from '../../database/entities/payload.entity';
import { EmployeeEntity } from '../../database/entities/employee.entity';
import { AttendanceEntity } from '../../database/entities/attendance.entity';
import { AdminLocationEntity } from '../../database/entities/admin_location.entity';
import { AdminCommonService } from '../admin-common/admin-common.service';
import { ReportDailyDto } from './dto/report-daily.dto';
import { ACCESS_PRIVILEGE, ADMIN_LOCATION_LEVEL_USER } from '../../utils/const';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const PDFDocument = require('pdfkit-table');
import moment from 'moment';
import {
  calculateDailyActualHours,
  calculateDailyHoursWorked,
  calculateDailyOverTime,
  calculateDailyUnderTime,
  calculateDailyWeekEnd,
  calculatePayDockingDays,
  calculatePeriodActualHours,
  calculatePeriodOverTime,
  calculatePeriodSaturdayHours,
  calculatePeriodSundayHours,
  calculatePeriodUnderTime,
  calculatePeriodWorkedTimes,
  getClockIn,
  getClockOut,
  getColumnWidth,
  getDates,
  getTableHeaderOption,
  getTableIndividualHeaderOption,
  getTableNameHeaderOption,
  normalizeReportName,
} from '../../utils/helper';
import { ReportWeeklyDto } from './dto/report-weekly.dto';
import { ReportMonthlyDto } from './dto/report-monthly.dto';
import { ReportFortnightlyDto } from './dto/report-fortnightly.dto';
import { ReportEmployeeDailyDto } from './dto/report-employee-daily.dto';
import { ReportEmployeeWeeklyDto } from './dto/report-employee-weekly.dto';
import { ReportEmployeeMonthlyDto } from './dto/report-employee-monthly.dto';
import { ReportEmployeeFortnightlyDto } from './dto/report-employee-fortnightly.dto';

@Injectable()
export class ReportService {
  constructor(
    private readonly adminCommonService: AdminCommonService,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(UserDetailEntity)
    private readonly userDetailRepo: Repository<UserDetailEntity>,
    @InjectRepository(PayloadEntity)
    private readonly payloadRepo: Repository<PayloadEntity>,
    @InjectRepository(EmployeeEntity)
    private readonly employeeRepo: Repository<EmployeeEntity>,
    @InjectRepository(AttendanceEntity)
    private readonly attendanceRepo: Repository<AttendanceEntity>,
    @InjectRepository(AdminLocationEntity)
    private readonly adminLocationRepo: Repository<AdminLocationEntity>,
  ) {}

  async printDaily(user_id: number, params: ReportDailyDto, res: Response) {
    const { admin_location_id, date } = params;
    const user = await this.userRepo.findOne(user_id, {
      relations: ['userDetail', 'admin_location'],
    });
    if (!user) {
      throw new HttpException('User with that id not exists', HttpStatus.BAD_REQUEST);
    }
    let admin_id = admin_location_id;
    if (user.admin_location_id != null) {
      admin_id = user.admin_location_id;
    }
    // check admin_location
    const admin_location = await this.adminCommonService.getAdminLocationById(admin_id);
    if (!admin_location) {
      throw new HttpException('Admin location does not exist', HttpStatus.BAD_REQUEST);
    }

    let accountLevel = 0; //0: Super admin, 1: Account No Desc User, 2: Paypoint Desc user
    let account_where = '';
    let paypoint_where = '';
    if (user.admin_location_level_user == ADMIN_LOCATION_LEVEL_USER.ACCOUNT_NO_DESC_USER) {
      account_where = user.userDetail.account_no_desc;
      accountLevel = 1;
    }
    if (user.admin_location_level_user == ADMIN_LOCATION_LEVEL_USER.PAYPOINT_DESC_USER) {
      account_where = user.userDetail.account_no_desc;
      paypoint_where = user.userDetail.paypoint_desc;
      accountLevel = 2;
    }

    const result = await this.adminCommonService.getGeneralList(
      admin_id,
      account_where,
      paypoint_where,
      date,
      '',
    );
    const rows = [];
    const formatDate = moment(date);
    const isSaturday = formatDate.day() === 6; // Saturday
    const isWeekend = formatDate.day() % 6 === 0;
    result.map((item, index) => {
      const attendance = JSON.parse(JSON.stringify(item));
      if (isWeekend) {
        rows.push([
          (index + 1).toString(),
          attendance['employee_no'],
          normalizeReportName(attendance['name_report']),
          attendance['occup_pos_title'],
          getClockIn(formatDate, attendance['dates']),
          getClockOut(formatDate, attendance['dates']),
          calculateDailyWeekEnd(formatDate, attendance['dates']),
        ]);
      } else {
        rows.push([
          (index + 1).toString(),
          attendance['employee_no'],
          normalizeReportName(attendance['name_report']),
          attendance['occup_pos_title'],
          getClockIn(formatDate, attendance['dates']),
          getClockOut(formatDate, attendance['dates']),
          calculateDailyHoursWorked(formatDate, attendance['dates']),
          calculateDailyActualHours(formatDate, attendance['dates']),
          calculateDailyUnderTime(formatDate, attendance['dates']),
          calculateDailyOverTime(formatDate, attendance['dates']),
        ]);
      }
    });

    const doc = new PDFDocument({ margin: 21, size: 'A4', layout: 'landscape' });
    // A4 595.28 x 841.89 (portrait) (about width sizes)
    doc.fontSize(12).font('Helvetica-Bold').fillColor('#4A4A4B');
    const table = {};
    if (isWeekend) {
      if (isSaturday) {
        table['headers'] = [
          getTableHeaderOption('No', 'no', 'center'),
          getTableHeaderOption('Employee\nnumber', 'employee_number', 'center'),
          getTableHeaderOption('Name Report', 'name_report', 'center'),
          getTableHeaderOption('Occup Post Title', 'occup_post_title', 'center'),
          getTableHeaderOption('Clock-in', 'clock_in', 'center'),
          getTableHeaderOption('Clock-out', 'clock_out', 'center'),
          getTableHeaderOption('Saturday\nHours', 'saturday_hours', 'center'),
        ];
      } else {
        table['headers'] = [
          getTableHeaderOption('No', 'no', 'center'),
          getTableHeaderOption('Employee\nnumber', 'employee_number', 'center'),
          getTableHeaderOption('Name Report', 'name_report', 'center'),
          getTableHeaderOption('Occup Post Title', 'occup_post_title', 'center'),
          getTableHeaderOption('Clock-in', 'clock_in', 'center'),
          getTableHeaderOption('Clock-out', 'clock_out', 'center'),
          getTableHeaderOption('Sunday\nHours', 'sunday_hours', 'center'),
        ];
      }
    } else {
      table['headers'] = [
        getTableHeaderOption('No', 'no', 'center'),
        getTableHeaderOption('Employee\nnumber', 'employee_number', 'center'),
        getTableHeaderOption('Name Report', 'name_report', 'center'),
        getTableHeaderOption('Occup Post Title', 'occup_post_title', 'center'),
        getTableHeaderOption('Clock-in', 'clock_in', 'center'),
        getTableHeaderOption('Clock-out', 'clock_out', 'center'),
        getTableHeaderOption('Work\nHours', 'work_hours', 'center'),
        getTableHeaderOption('Actual\nHours', 'actual_hours', 'center'),
        getTableHeaderOption('Under\nTime', 'under_time', 'center'),
        getTableHeaderOption('Overtime', 'over_time', 'center'),
      ];
    }
    table['subtitle'] = `Staff Attendance Report for ${moment
      .utc(date)
      .format('dddd Do MMMM YYYY')}`;
    table['rows'] = rows;
    doc.text(
      'RECORD OF ATTENDANCE FOR PURPOSES OF DEDUCTING PAY FOR UNAUTHORIZED ABSENCE (PAYROLL CODE – LWOP)',
      {
        align: 'center',
        underline: true,
      },
    );
    doc.text(`SPECIAL GENERAL ORDER NO.11 OF 2019`, { align: 'center', underline: true });
    doc.moveDown();
    doc.text(`AGENCY NAME: ${admin_location.admin_desc}`, { align: 'center' });
    doc.moveDown();
    switch (accountLevel) {
      case 1:
        // admin no desc
        doc.text(`Division: ${account_where}`, { align: 'center' });
        doc.moveDown();
        break;
      case 2:
        // paypoint desc
        doc.text(`Division: ${account_where}        Branch: ${paypoint_where}`, {
          align: 'center',
        });
        doc.moveDown();
        break;
    }
    let columnsSize = [];
    if (isWeekend) {
      columnsSize = [
        getColumnWidth(800, 7), // 4%
        getColumnWidth(800, 10), // 7%
        getColumnWidth(800, 20), // 13%
        getColumnWidth(800, 30), // 18%
        getColumnWidth(800, 11), // 8%
        getColumnWidth(800, 11), // 8%
        getColumnWidth(800, 11), // 7%
      ];
    } else {
      columnsSize = [
        getColumnWidth(800, 4), // 4%
        getColumnWidth(800, 7), // 7%
        getColumnWidth(800, 13), // 13%
        getColumnWidth(800, 28), // 18%
        getColumnWidth(800, 8), // 8%
        getColumnWidth(800, 8), // 8%
        getColumnWidth(800, 8), // 7%
        getColumnWidth(800, 8), // 7%
        getColumnWidth(800, 8), // 7%
        getColumnWidth(800, 8), // 7%
      ];
    }
    await doc.table(table, {
      columnsSize: columnsSize,
    });
    doc.moveDown();
    doc.fontSize(12).font('Helvetica-Bold').fillColor('#4A4A4B');
    doc.text('Report produced by PNG Time Access WoG Cloud Attendance System', { align: 'center' });
    doc.pipe(res);
    doc.end();
  }

  async printWeekly(user_id: number, params: ReportWeeklyDto, res: Response) {
    const { admin_location_id, date } = params;
    const user = await this.userRepo.findOne(user_id, {
      relations: ['userDetail', 'admin_location'],
    });
    if (!user) {
      throw new HttpException('User with that id not exists', HttpStatus.BAD_REQUEST);
    }
    let admin_id = admin_location_id;
    if (user.admin_location_id != null) {
      admin_id = user.admin_location_id;
    }
    // check admin_location
    const admin_location = await this.adminCommonService.getAdminLocationById(admin_id);
    if (!admin_location) {
      throw new HttpException('Admin location does not exist', HttpStatus.BAD_REQUEST);
    }
    let accountLevel = 0; //0: Super admin, 1: Account No Desc User, 2: Paypoint Desc user
    let account_where = '';
    let paypoint_where = '';
    if (user.admin_location_level_user == ADMIN_LOCATION_LEVEL_USER.ACCOUNT_NO_DESC_USER) {
      account_where = user.userDetail.account_no_desc;
      accountLevel = 1;
    }
    if (user.admin_location_level_user == ADMIN_LOCATION_LEVEL_USER.PAYPOINT_DESC_USER) {
      account_where = user.userDetail.account_no_desc;
      paypoint_where = user.userDetail.paypoint_desc;
      accountLevel = 2;
    }

    const target = moment(date, 'YYYY-MM-DD');
    const start_at = target.weekday(1).format('YYYY-MM-DD');
    const end_at = moment(start_at, 'YYYY-MM-DD').add(6, 'days').format('YYYY-MM-DD');

    const result = await this.adminCommonService.getGeneralList(
      admin_id,
      account_where,
      paypoint_where,
      start_at,
      end_at,
    );
    const rows = [];
    const dates = getDates(start_at, 6);

    result.map((item, index) => {
      const attendance = JSON.parse(JSON.stringify(item));
      rows.push([
        (index + 1).toString(),
        attendance['employee_no'],
        normalizeReportName(attendance['name_report']),
        attendance['occup_pos_title'],
        calculatePeriodWorkedTimes(dates, attendance['dates']),
        calculatePeriodActualHours(dates, attendance['dates']),
        calculatePeriodUnderTime(dates, attendance['dates']),
        calculatePeriodOverTime(dates, attendance['dates']),
        calculatePeriodSaturdayHours(dates, attendance['dates']),
        calculatePeriodSundayHours(dates, attendance['dates']),
      ]);
    });
    const doc = new PDFDocument({ margin: 21, size: 'A4', layout: 'landscape' });
    // A4 595.28 x 841.89 (portrait) (about width sizes)
    doc.fontSize(12).font('Helvetica-Bold').fillColor('#4A4A4B');
    doc.text(
      'RECORD OF ATTENDANCE FOR PURPOSES OF DEDUCTING PAY FOR UNAUTHORIZED ABSENCE (PAYROLL CODE – LWOP)',
      {
        align: 'center',
        underline: true,
      },
    );
    doc.text(`SPECIAL GENERAL ORDER NO.11 OF 2019`, { align: 'center', underline: true });
    doc.moveDown();
    doc.text(`AGENCY NAME: ${admin_location.admin_desc}`, { align: 'center' });
    doc.moveDown();
    switch (accountLevel) {
      case 1:
        // admin no desc
        doc.text(`Division: ${account_where}`, { align: 'center' });
        doc.moveDown();
        break;
      case 2:
        // paypoint desc
        doc.text(`Division: ${account_where}        Branch: ${paypoint_where}`, {
          align: 'center',
        });
        doc.moveDown();
        break;
    }
    const table = {
      headers: [
        getTableHeaderOption('No', 'no', 'center'),
        getTableHeaderOption('Employee\nnumber', 'employee_number', 'center'),
        getTableHeaderOption('Name Report', 'name_report', 'center'),
        getTableHeaderOption('Occup Post Title', 'occup_post_title', 'center'),
        getTableHeaderOption('Work\nHours', 'work_hours', 'center'),
        getTableHeaderOption('Actual\nHours', 'actual_hours', 'center'),
        getTableHeaderOption('Under\nTime', 'under_time', 'center'),
        getTableHeaderOption('Overtime', 'over_time', 'center'),
        getTableHeaderOption('Saturday\nHours', 'saturday_hours', 'center'),
        getTableHeaderOption('Sunday\nHours', 'sunday_hours', 'center'),
      ],
    };
    table['subtitle'] = `Staff Attendance Report for Week ${target.format('w')} ${moment(
      start_at,
    ).format('dddd Do MMMM YYYY')} to ${moment(end_at).format('dddd Do MMMM YYYY')}`;
    table['rows'] = rows;
    await doc.table(table, {
      columnsSize: [
        getColumnWidth(800, 5),
        getColumnWidth(800, 9),
        getColumnWidth(800, 15),
        getColumnWidth(800, 29),
        getColumnWidth(800, 7),
        getColumnWidth(800, 7),
        getColumnWidth(800, 7),
        getColumnWidth(800, 7),
        getColumnWidth(800, 7),
        getColumnWidth(800, 7),
      ],
    });

    doc.moveDown();
    doc.fontSize(12).font('Helvetica-Bold').fillColor('#4A4A4B');
    doc.text('Report produced by PNG Time Access WoG Cloud Attendance System', { align: 'center' });

    doc.pipe(res);
    doc.end();
  }

  async printMonthly(user_id: number, params: ReportMonthlyDto, res: Response) {
    const { admin_location_id, date } = params;
    const user = await this.userRepo.findOne(user_id, {
      relations: ['userDetail', 'admin_location'],
    });
    if (!user) {
      throw new HttpException('User with that id not exists', HttpStatus.BAD_REQUEST);
    }
    let admin_id = admin_location_id;
    if (user.admin_location_id != null) {
      admin_id = user.admin_location_id;
    }
    // check admin_location
    const admin_location = await this.adminCommonService.getAdminLocationById(admin_id);
    if (!admin_location) {
      throw new HttpException('Admin location does not exist', HttpStatus.BAD_REQUEST);
    }
    let accountLevel = 0; //0: Super admin, 1: Account No Desc User, 2: Paypoint Desc user
    let account_where = '';
    let paypoint_where = '';
    if (user.admin_location_level_user == ADMIN_LOCATION_LEVEL_USER.ACCOUNT_NO_DESC_USER) {
      account_where = user.userDetail.account_no_desc;
      accountLevel = 1;
    }
    if (user.admin_location_level_user == ADMIN_LOCATION_LEVEL_USER.PAYPOINT_DESC_USER) {
      account_where = user.userDetail.account_no_desc;
      paypoint_where = user.userDetail.paypoint_desc;
      accountLevel = 2;
    }
    const target = moment(date, 'YYYY-MM-DD');
    const start_at = target.startOf('month').format('YYYY-MM-DD');
    const end_at = target.endOf('month').format('YYYY-MM-DD');
    const days = target.daysInMonth();
    const result = await this.adminCommonService.getGeneralList(
      admin_id,
      account_where,
      paypoint_where,
      start_at,
      end_at,
    );
    const rows = [];
    const dates = getDates(start_at, days);
    result.map((item, index) => {
      const attendance = JSON.parse(JSON.stringify(item));
      rows.push([
        (index + 1).toString(),
        attendance['employee_no'],
        normalizeReportName(attendance['name_report']),
        attendance['occup_pos_title'],
        calculatePeriodWorkedTimes(dates, attendance['dates']),
        calculatePeriodActualHours(dates, attendance['dates']),
        calculatePeriodUnderTime(dates, attendance['dates']),
        calculatePeriodOverTime(dates, attendance['dates']),
        calculatePeriodSaturdayHours(dates, attendance['dates']),
        calculatePeriodSundayHours(dates, attendance['dates']),
      ]);
    });

    const doc = new PDFDocument({ margin: 21, size: 'A4', layout: 'landscape' });
    // A4 595.28 x 841.89 (portrait) (about width sizes)
    doc.fontSize(12).font('Helvetica-Bold').fillColor('#4A4A4B');
    doc.text(
      'RECORD OF ATTENDANCE FOR PURPOSES OF DEDUCTING PAY FOR UNAUTHORIZED ABSENCE (PAYROLL CODE – LWOP)',
      {
        align: 'center',
        underline: true,
      },
    );
    doc.text(`SPECIAL GENERAL ORDER NO.11 OF 2019`, { align: 'center', underline: true });
    doc.moveDown();
    doc.text(`AGENCY NAME: ${admin_location.admin_desc}`, { align: 'center' });
    doc.moveDown();

    switch (accountLevel) {
      case 1:
        // admin no desc
        doc.text(`Division: ${account_where}`, { align: 'center' });
        doc.moveDown();
        break;
      case 2:
        // paypoint desc
        doc.text(`Division: ${account_where}        Branch: ${paypoint_where}`, {
          align: 'center',
        });
        doc.moveDown();
        break;
    }

    const table = {
      headers: [
        getTableHeaderOption('No', 'no', 'center'),
        getTableHeaderOption('Employee\nnumber', 'employee_number', 'center'),
        getTableHeaderOption('Name Report', 'name_report', 'center'),
        getTableHeaderOption('Occup Post Title', 'occup_post_title', 'center'),
        getTableHeaderOption('Work\nHours', 'work_hours', 'center'),
        getTableHeaderOption('Actual\nHours', 'actual_hours', 'center'),
        getTableHeaderOption('Under\nTime', 'under_time', 'center'),
        getTableHeaderOption('Overtime', 'over_time', 'center'),
        getTableHeaderOption('Saturday\nHours', 'saturday_hours', 'center'),
        getTableHeaderOption('Sunday\nHours', 'sunday_hours', 'center'),
      ],
    };
    table['subtitle'] = `Staff Attendance Report for month of ${target.format('MMMM YYYY')}`;
    table['rows'] = rows;
    await doc.table(table, {
      columnsSize: [
        getColumnWidth(800, 5),
        getColumnWidth(800, 9),
        getColumnWidth(800, 15),
        getColumnWidth(800, 29),
        getColumnWidth(800, 7),
        getColumnWidth(800, 7),
        getColumnWidth(800, 7),
        getColumnWidth(800, 7),
        getColumnWidth(800, 7),
        getColumnWidth(800, 7),
      ],
    });

    doc.moveDown();
    doc.fontSize(12).font('Helvetica-Bold').fillColor('#4A4A4B');
    doc.text('Report produced by PNG Time Access WoG Cloud Attendance System', { align: 'center' });

    doc.pipe(res);
    doc.end();
  }

  async printFortnightly(user_id: number, params: ReportFortnightlyDto, res: Response) {
    const { admin_location_id, pay_no } = params;
    const user = await this.userRepo.findOne(user_id, {
      relations: ['userDetail', 'admin_location'],
    });
    if (!user) {
      throw new HttpException('User with that id not exists', HttpStatus.BAD_REQUEST);
    }
    let admin_id = admin_location_id;
    if (user.admin_location_id != null) {
      admin_id = user.admin_location_id;
    }
    // check admin_location
    const admin_location = await this.adminCommonService.getAdminLocationById(admin_id);
    if (!admin_location) {
      throw new HttpException('Admin location does not exist', HttpStatus.BAD_REQUEST);
    }
    let accountLevel = 0; //0: Super admin, 1: Account No Desc User, 2: Paypoint Desc user
    let account_where = '';
    let paypoint_where = '';
    if (user.admin_location_level_user == ADMIN_LOCATION_LEVEL_USER.ACCOUNT_NO_DESC_USER) {
      account_where = user.userDetail.account_no_desc;
      accountLevel = 1;
    }
    if (user.admin_location_level_user == ADMIN_LOCATION_LEVEL_USER.PAYPOINT_DESC_USER) {
      account_where = user.userDetail.account_no_desc;
      paypoint_where = user.userDetail.paypoint_desc;
      accountLevel = 2;
    }
    let payloadWhere = {};
    if (pay_no === -1) {
      payloadWhere = {
        start_at: LessThanOrEqual(new Date()),
        end_at: MoreThanOrEqual(new Date()),
      };
    } else {
      payloadWhere = {
        id: pay_no,
      };
    }

    const payload = await this.payloadRepo.findOne({
      where: payloadWhere,
    });
    if (!payload) {
      throw new HttpException('Payload not found', HttpStatus.BAD_REQUEST);
    }

    const start_at = moment(payload.start_at).format('YYYY-MM-DD');
    const end_at = moment(payload.end_at).format('YYYY-MM-DD');

    const result = await this.adminCommonService.getGeneralList(
      admin_id,
      account_where,
      paypoint_where,
      start_at,
      end_at,
    );
    const rows = [];
    const dates = getDates(start_at, 14);
    result.map((item, index) => {
      const attendance = JSON.parse(JSON.stringify(item));
      rows.push([
        (index + 1).toString(),
        attendance['employee_no'],
        normalizeReportName(attendance['name_report']),
        attendance['occup_pos_title'],
        calculatePeriodWorkedTimes(dates, attendance['dates']),
        calculatePeriodActualHours(dates, attendance['dates']),
        calculatePeriodUnderTime(dates, attendance['dates']),
        calculatePeriodOverTime(dates, attendance['dates']),
        calculatePeriodSaturdayHours(dates, attendance['dates']),
        calculatePeriodSundayHours(dates, attendance['dates']),
      ]);
    });

    const doc = new PDFDocument({ margin: 21, size: 'A4', layout: 'landscape' });
    // A4 595.28 x 841.89 (portrait) (about width sizes)
    doc.fontSize(12).font('Helvetica-Bold').fillColor('#4A4A4B');
    doc.text(
      'RECORD OF ATTENDANCE FOR PURPOSES OF DEDUCTING PAY FOR UNAUTHORIZED ABSENCE (PAYROLL CODE – LWOP)',
      {
        align: 'center',
        underline: true,
      },
    );
    doc.text(`SPECIAL GENERAL ORDER NO.11 OF 2019`, { align: 'center', underline: true });
    doc.moveDown();
    doc.text(`AGENCY NAME: ${admin_location.admin_desc}`, { align: 'center' });
    doc.moveDown();
    switch (accountLevel) {
      case 1:
        // admin no desc
        doc.text(`Division: ${account_where}`, { align: 'center' });
        doc.moveDown();
        break;
      case 2:
        // paypoint desc
        doc.text(`Division: ${account_where}        Branch: ${paypoint_where}`, {
          align: 'center',
        });
        doc.moveDown();
        break;
    }
    const table = {
      headers: [
        getTableHeaderOption('No', 'no', 'center'),
        getTableHeaderOption('Employee\nnumber', 'employee_number', 'center'),
        getTableHeaderOption('Name Report', 'name_report', 'center'),
        getTableHeaderOption('Occup Post Title', 'occup_post_title', 'center'),
        getTableHeaderOption('Total\nHours', 'total_hours', 'center'),
        getTableHeaderOption('Total\nActual\nHours', 'total_actual_hours', 'center'),
        getTableHeaderOption('Total\nUnder\nTime', 'total_under_time', 'center'),
        getTableHeaderOption('Total\nOvertime', 'total_overtime', 'center'),
        getTableHeaderOption('Total\nSaturday\nHours', 'total_saturday_hours', 'center'),
        getTableHeaderOption('Total\nSunday\nHours', 'total_sunday_hours', 'center'),
      ],
    };
    table['subtitle'] =
      'Staff Attendance Report for Pay No.' +
      payload.pay_no +
      ` (${moment.utc(payload.start_at).format('ddd DD/MM/YYYY')} to ${moment
        .utc(payload.end_at)
        .format('ddd DD/MM/YYYY')})`;
    table['rows'] = rows;
    await doc.table(table, {
      columnsSize: [
        getColumnWidth(800, 5), // 5%
        getColumnWidth(800, 9), // 10%
        getColumnWidth(800, 15), // 10%
        getColumnWidth(800, 29), // 10%
        getColumnWidth(800, 7), // 10%
        getColumnWidth(800, 7), // 10%
        getColumnWidth(800, 7), // 10%
        getColumnWidth(800, 7), // 10%
        getColumnWidth(800, 7), // 10%
        getColumnWidth(800, 7), // 10%
      ],
    });
    doc.moveDown();
    doc.fontSize(12).font('Helvetica-Bold').fillColor('#4A4A4B');
    doc.text('Report produced by PNG Time Access WoG Cloud Attendance System', { align: 'center' });

    doc.pipe(res);
    doc.end();
  }

  //---------------------------PRINT EMPLOYEE REPORT--------------------------
  async printEmployeeDaily(user_id: number, params: ReportEmployeeDailyDto, res: Response) {
    const { admin_location_id, date, employee_no } = params;
    const user = await this.userRepo.findOne(user_id, {
      relations: ['userDetail', 'admin_location'],
    });
    if (!user) {
      throw new HttpException('User with that id not exists', HttpStatus.BAD_REQUEST);
    }
    let admin_id = admin_location_id;
    if (user.admin_location_id != null) {
      admin_id = user.admin_location_id;
    }
    // check admin_location
    const admin_location = await this.adminCommonService.getAdminLocationById(admin_id);
    if (!admin_location) {
      throw new HttpException('Admin location does not exist', HttpStatus.BAD_REQUEST);
    }

    let accountLevel = 0; //0: Super admin, 1: Account No Desc User, 2: Paypoint Desc user
    let account_where = '';
    let paypoint_where = '';
    if (user.admin_location_level_user == ADMIN_LOCATION_LEVEL_USER.ACCOUNT_NO_DESC_USER) {
      account_where = user.userDetail.account_no_desc;
      accountLevel = 1;
    }
    if (user.admin_location_level_user == ADMIN_LOCATION_LEVEL_USER.PAYPOINT_DESC_USER) {
      account_where = user.userDetail.account_no_desc;
      paypoint_where = user.userDetail.paypoint_desc;
      accountLevel = 2;
    }
    const employeeBuilder = this.employeeRepo.createQueryBuilder('');
    employeeBuilder
      .where('employee_no = :no', { no: employee_no })
      .andWhere('admin_location_id = :id', { id: admin_location_id });
    if (account_where != '') {
      employeeBuilder.andWhere('account_no_desc = :account', { account: account_where });
    }
    if (paypoint_where != '') {
      employeeBuilder.andWhere('paypoint_desc = :paypoint', { paypoint: paypoint_where });
    }

    const employeeItem = await employeeBuilder.getOne();
    if (!employeeItem) {
      throw new HttpException('Employee with that no not exists', HttpStatus.BAD_REQUEST);
    }

    const employee = {
      id: employeeItem.id,
      employee_no: employeeItem.employee_no,
      name_report: employeeItem.name_report,
      occup_pos_title: employeeItem.occup_pos_title,
      admin_desc: admin_location.admin_desc,
      dates: {},
    };
    employee.dates = await this.adminCommonService.getAttendanceOne(employeeItem.id, date, '');

    const formatDate = moment(date);
    const isSaturday = formatDate.day() === 6; // Saturday
    const isWeekend = formatDate.day() % 6 === 0;
    const attendance = JSON.parse(JSON.stringify(employee));
    const realPageSize = 530;
    const doc = new PDFDocument({ margin: 31.14, size: 'A4' });
    // A4 595.28 x 841.89 (portrait) (about width sizes)
    doc.moveDown(2);
    doc.fontSize(12).font('Helvetica-Bold').fillColor('#4A4A4B');
    doc.text(
      'RECORD OF ATTENDANCE FOR PURPOSES OF DEDUCTING \nPAY FOR UNAUTHORIZED ABSENCE (PAYROLL CODE – LWOP)',
      {
        align: 'center',
        underline: true,
      },
    );
    doc.text(`SPECIAL GENERAL ORDER NO.11 OF 2019`, { align: 'center', underline: true });
    doc.moveDown(1);
    doc.text(`AGENCY NAME: ${admin_location.admin_desc}`, { align: 'center' });
    doc.moveDown(1);
    switch (accountLevel) {
      case 1:
        // admin no desc
        doc.text(`Division: ${account_where}`, { align: 'center' });
        doc.moveDown();
        break;
      case 2:
        // paypoint desc
        doc.text(`Division: ${account_where}        Branch: ${paypoint_where}`, {
          align: 'center',
        });
        doc.moveDown();
        break;
    }
    doc.text(`Staff Attendance Report for ${moment.utc(date).format('dddd Do MMMM YYYY')}`, {
      align: 'center',
    });
    doc.moveDown(1);
    const officerTable = {
      headers: [
        getTableNameHeaderOption('start'),
        getTableNameHeaderOption('start'),
        getTableNameHeaderOption('start'),
        getTableNameHeaderOption('start'),
        getTableNameHeaderOption('start'),
        getTableNameHeaderOption('start'),
      ],
    };
    officerTable['rows'] = [
      [
        'Name of officer:',
        normalizeReportName(employee['name_report']),
        '',
        'Payroll File Number:',
        employee['employee_no'],
      ],
    ];
    await doc.table(officerTable, {
      prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
        const { x, y, width, height } = rectCell;
        if (indexRow === 0) {
          if (indexColumn === 1 || indexColumn === 4) {
            doc
              .lineWidth(0.5)
              .moveTo(x, y + height)
              .lineTo(x + width, y + height)
              .stroke();
          }
        }
        doc.font('Helvetica-Bold');
        doc.fontSize(12);
        doc.fillColor('#4A4A4B');
      },
      divider: {
        header: { disabled: true },
        horizontal: { disabled: true },
      },
      columnSpacing: 0,
      hideHeader: true,
      width: realPageSize,
      columnsSize: [100, 145, 20, 120, 145],
    });
    doc.moveDown(1);

    const table = {};
    if (isWeekend) {
      if (isSaturday) {
        table['headers'] = [
          getTableIndividualHeaderOption('Day', 'day', 'start'),
          getTableIndividualHeaderOption('Clock-in', 'clock_in', 'center'),
          getTableIndividualHeaderOption('Clock-out', 'clock_out', 'center'),
          getTableIndividualHeaderOption('Saturday Hours', 'saturday_hours', 'center'),
        ];
      } else {
        table['headers'] = [
          getTableIndividualHeaderOption('Day', 'day', 'start'),
          getTableIndividualHeaderOption('Clock-in', 'clock_in', 'center'),
          getTableIndividualHeaderOption('Clock-out', 'clock_out', 'center'),
          getTableIndividualHeaderOption('Sunday Hours', 'sunday_hours', 'center'),
        ];
      }
    } else {
      table['headers'] = [
        getTableIndividualHeaderOption('Day', 'day', 'start'),
        getTableIndividualHeaderOption('Clock-in', 'clock_in', 'center'),
        getTableIndividualHeaderOption('Clock-out', 'clock_out', 'center'),
        getTableIndividualHeaderOption('Hrs Worked', 'hrs_worked', 'center'),
        getTableIndividualHeaderOption('Actual Hours', 'actual_worked', 'center'),
        getTableIndividualHeaderOption('Under Time', 'under_time', 'center'),
        getTableIndividualHeaderOption('Overtime', 'over_time', 'center'),
      ];
    }
    let columnsSize = [];
    if (isWeekend) {
      columnsSize = [
        getColumnWidth(realPageSize, 25), // 15%
        getColumnWidth(realPageSize, 25), // 15%
        getColumnWidth(realPageSize, 25), // 15%
        getColumnWidth(realPageSize, 25), // 15%
      ];
    } else {
      columnsSize = [
        getColumnWidth(realPageSize, 16), // 15%
        getColumnWidth(realPageSize, 14), // 15%
        getColumnWidth(realPageSize, 14), // 15%
        getColumnWidth(realPageSize, 14), // 15%
        getColumnWidth(realPageSize, 14), // 15%
        getColumnWidth(realPageSize, 14), // 15%
        getColumnWidth(realPageSize, 14), // 15%
      ];
    }

    const rows = [];
    if (isWeekend) {
      rows.push([
        formatDate.format('ddd DD/MM/YYYY'),
        getClockIn(formatDate, attendance['dates']),
        getClockOut(formatDate, attendance['dates']),
        calculateDailyWeekEnd(formatDate, attendance['dates']),
      ]);
    } else {
      rows.push([
        formatDate.format('ddd DD/MM/YYYY'),
        getClockIn(formatDate, attendance['dates']),
        getClockOut(formatDate, attendance['dates']),
        calculateDailyHoursWorked(formatDate, attendance['dates']),
        calculateDailyActualHours(formatDate, attendance['dates']),
        calculateDailyUnderTime(formatDate, attendance['dates']),
        calculateDailyOverTime(formatDate, attendance['dates']),
      ]);
    }
    table['rows'] = rows;
    await doc.table(table, {
      prepareHeader: () => doc.font('Helvetica-Bold').fontSize(10),
      prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
        doc.font('Helvetica');
        doc.fontSize(10);
      },
      columnSpacing: 0,
      padding: 0,
      divider: {
        header: { disabled: true },
        horizontal: { disabled: true },
      },
      columnsSize: columnsSize,
    });

    doc.moveDown();
    doc.fontSize(12).font('Helvetica-Bold').fillColor('#4A4A4B');
    doc.text('Report produced by PNG Time Access WoG Cloud Attendance System', { align: 'center' });
    doc.moveDown(1);
    doc.pipe(res);
    doc.end();
  }

  async printEmployeeWeekly(user_id: number, params: ReportEmployeeWeeklyDto, res: Response) {
    const { admin_location_id, date, employee_no } = params;
    const user = await this.userRepo.findOne(user_id, {
      relations: ['userDetail', 'admin_location'],
    });
    if (!user) {
      throw new HttpException('User with that id not exists', HttpStatus.BAD_REQUEST);
    }
    let admin_id = admin_location_id;
    if (user.admin_location_id != null) {
      admin_id = user.admin_location_id;
    }
    // check admin_location
    const admin_location = await this.adminCommonService.getAdminLocationById(admin_id);
    if (!admin_location) {
      throw new HttpException('Admin location does not exist', HttpStatus.BAD_REQUEST);
    }

    let accountLevel = 0; //0: Super admin, 1: Account No Desc User, 2: Paypoint Desc user
    let account_where = '';
    let paypoint_where = '';
    if (user.admin_location_level_user == ADMIN_LOCATION_LEVEL_USER.ACCOUNT_NO_DESC_USER) {
      account_where = user.userDetail.account_no_desc;
      accountLevel = 1;
    }
    if (user.admin_location_level_user == ADMIN_LOCATION_LEVEL_USER.PAYPOINT_DESC_USER) {
      account_where = user.userDetail.account_no_desc;
      paypoint_where = user.userDetail.paypoint_desc;
      accountLevel = 2;
    }
    const employeeBuilder = this.employeeRepo.createQueryBuilder();
    employeeBuilder
      .where('employee_no = :no', { no: employee_no })
      .andWhere('admin_location_id = :id', { id: admin_location_id });
    if (account_where != '') {
      employeeBuilder.andWhere('account_no_desc = :account', { account: account_where });
    }
    if (paypoint_where != '') {
      employeeBuilder.andWhere('paypoint_desc = :paypoint', { paypoint: paypoint_where });
    }

    const employeeItem = await employeeBuilder.getOne();
    if (!employeeItem) {
      throw new HttpException('Employee with that no not exists', HttpStatus.BAD_REQUEST);
    }
    const employee = {
      id: employeeItem.id,
      employee_no: employeeItem.employee_no,
      name_report: employeeItem.name_report,
      occup_pos_title: employeeItem.occup_pos_title,
      admin_desc: admin_location.admin_desc,
      dates: {},
    };

    const target = moment(date, 'YYYY-MM-DD');
    const start_at = target.weekday(1).format('YYYY-MM-DD');
    const end_at = moment(start_at, 'YYYY-MM-DD').add(6, 'days').format('YYYY-MM-DD');
    employee.dates = await this.adminCommonService.getAttendanceOne(
      employeeItem.id,
      start_at,
      end_at,
    );

    const rows = [];
    const dates = getDates(start_at, 7, true);
    const attendance = JSON.parse(JSON.stringify(employee));
    dates.map((date) => {
      rows.push([
        date.format('ddd DD/MM/YYYY'),
        getClockIn(date, attendance['dates']),
        getClockOut(date, attendance['dates']),
        calculateDailyHoursWorked(date, attendance['dates']),
        calculateDailyActualHours(date, attendance['dates']),
        calculateDailyUnderTime(date, attendance['dates']),
        calculateDailyOverTime(date, attendance['dates']),
      ]);
    });

    const realPageSize = 530;
    const doc = new PDFDocument({ margin: 31.14, size: 'A4' });
    // A4 595.28 x 841.89 (portrait) (about width sizes)
    doc.moveDown(2);
    doc.fontSize(12).font('Helvetica-Bold').fillColor('#4A4A4B');
    doc.text(
      'RECORD OF ATTENDANCE FOR PURPOSES OF DEDUCTING \nPAY FOR UNAUTHORIZED ABSENCE (PAYROLL CODE – LWOP)',
      {
        align: 'center',
        underline: true,
      },
    );
    doc.text(`SPECIAL GENERAL ORDER NO.11 OF 2019`, { align: 'center', underline: true });
    doc.moveDown(1);
    doc.text(`AGENCY NAME: ${admin_location.admin_desc}`, { align: 'center' });
    doc.moveDown(1);
    switch (accountLevel) {
      case 1:
        // admin no desc
        doc.text(`Division: ${account_where}`, { align: 'center' });
        doc.moveDown();
        break;
      case 2:
        // paypoint desc
        doc.text(`Division: ${account_where}        Branch: ${paypoint_where}`, {
          align: 'center',
        });
        doc.moveDown();
        break;
    }
    doc.text(
      `Staff Attendance Report for Week ${target.format('w')} ${moment(start_at).format(
        'dddd Do MMMM YYYY',
      )} to ${moment(end_at).format('dddd Do MMMM YYYY')}`,
      { align: 'center' },
    );
    doc.moveDown(1);
    const officerTable = {
      headers: [
        getTableNameHeaderOption('start'),
        getTableNameHeaderOption('start'),
        getTableNameHeaderOption('start'),
        getTableNameHeaderOption('start'),
        getTableNameHeaderOption('start'),
        getTableNameHeaderOption('start'),
      ],
    };
    officerTable['rows'] = [
      [
        'Name of officer:',
        normalizeReportName(employee['name_report']),
        '',
        'Payroll File Number:',
        employee['employee_no'],
      ],
    ];
    await doc.table(officerTable, {
      prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
        const { x, y, width, height } = rectCell;
        if (indexRow === 0) {
          if (indexColumn === 1 || indexColumn === 4) {
            doc
              .lineWidth(0.5)
              .moveTo(x, y + height)
              .lineTo(x + width, y + height)
              .stroke();
          }
        }
        doc.font('Helvetica-Bold');
        doc.fontSize(12);
        doc.fillColor('#4A4A4B');
      },
      divider: {
        header: { disabled: true },
        horizontal: { disabled: true },
      },
      columnSpacing: 0,
      hideHeader: true,
      width: realPageSize,
      columnsSize: [100, 145, 20, 120, 145],
    });
    doc.moveDown(1);

    const table = {
      headers: [
        getTableIndividualHeaderOption('Day', 'day', 'start'),
        getTableIndividualHeaderOption('Clock-in', 'clock_in', 'center'),
        getTableIndividualHeaderOption('Clock-out', 'clock_out', 'center'),
        getTableIndividualHeaderOption('Hrs Worked', 'hrs_worked', 'center'),
        getTableIndividualHeaderOption('Actual Hours', 'actual_worked', 'center'),
        getTableIndividualHeaderOption('Under Time', 'under_time', 'center'),
        getTableIndividualHeaderOption('Overtime', 'over_time', 'center'),
      ],
    };
    table['rows'] = rows;
    await doc.table(table, {
      prepareHeader: () => doc.font('Helvetica-Bold').fontSize(10),
      prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
        doc.font('Helvetica');
        doc.fontSize(10);
      },
      columnSpacing: 0,
      padding: 0,
      divider: {
        header: { disabled: true },
        horizontal: { disabled: true },
      },
      columnsSize: [
        getColumnWidth(realPageSize, 16), // 15%
        getColumnWidth(realPageSize, 14), // 15%
        getColumnWidth(realPageSize, 14), // 15%
        getColumnWidth(realPageSize, 14), // 15%
        getColumnWidth(realPageSize, 14), // 15%
        getColumnWidth(realPageSize, 14), // 15%
        getColumnWidth(realPageSize, 14), // 15%
      ],
    });
    doc.moveDown();
    doc.fontSize(12).font('Helvetica-Bold').fillColor('#4A4A4B');
    doc.text(`Total Under Time Hours: ${calculatePeriodUnderTime(dates, attendance['dates'])}`);
    doc.text(`Total Overtime Hours: ${calculatePeriodOverTime(dates, attendance['dates'])}`);
    doc.text(`Total Saturday Hours: ${calculatePeriodSaturdayHours(dates, attendance['dates'])}`);
    doc.text(`Total Sunday Hours: ${calculatePeriodSundayHours(dates, attendance['dates'])}`);
    doc.moveDown();

    doc.text('Report produced by PNG Time Access WoG Cloud Attendance System', { align: 'center' });
    doc.moveDown(1);
    doc.pipe(res);
    doc.end();
  }

  async printEmployeeMonthly(user_id: number, params: ReportEmployeeMonthlyDto, res: Response) {
    const { admin_location_id, date, employee_no } = params;
    const user = await this.userRepo.findOne(user_id, {
      relations: ['userDetail', 'admin_location'],
    });
    if (!user) {
      throw new HttpException('User with that id not exists', HttpStatus.BAD_REQUEST);
    }
    let admin_id = admin_location_id;
    if (user.admin_location_id != null) {
      admin_id = user.admin_location_id;
    }
    // check admin_location
    const admin_location = await this.adminCommonService.getAdminLocationById(admin_id);
    if (!admin_location) {
      throw new HttpException('Admin location does not exist', HttpStatus.BAD_REQUEST);
    }

    let accountLevel = 0; //0: Super admin, 1: Account No Desc User, 2: Paypoint Desc user
    let account_where = '';
    let paypoint_where = '';
    if (user.admin_location_level_user == ADMIN_LOCATION_LEVEL_USER.ACCOUNT_NO_DESC_USER) {
      account_where = user.userDetail.account_no_desc;
      accountLevel = 1;
    }
    if (user.admin_location_level_user == ADMIN_LOCATION_LEVEL_USER.PAYPOINT_DESC_USER) {
      account_where = user.userDetail.account_no_desc;
      paypoint_where = user.userDetail.paypoint_desc;
      accountLevel = 2;
    }
    const employeeBuilder = this.employeeRepo.createQueryBuilder();
    employeeBuilder
      .where('employee_no = :no', { no: employee_no })
      .andWhere('admin_location_id = :id', { id: admin_location_id });
    if (account_where != '') {
      employeeBuilder.andWhere('account_no_desc = :account', { account: account_where });
    }
    if (paypoint_where != '') {
      employeeBuilder.andWhere('paypoint_desc = :paypoint', { paypoint: paypoint_where });
    }

    const employeeItem = await employeeBuilder.getOne();
    if (!employeeItem) {
      throw new HttpException('Employee with that no not exists', HttpStatus.BAD_REQUEST);
    }
    const employee = {
      id: employeeItem.id,
      employee_no: employeeItem.employee_no,
      name_report: employeeItem.name_report,
      occup_pos_title: employeeItem.occup_pos_title,
      admin_desc: admin_location.admin_desc,
      dates: {},
    };
    const target = moment(date, 'YYYY-MM-DD');
    const start_at = target.startOf('month').format('YYYY-MM-DD');
    const end_at = target.endOf('month').format('YYYY-MM-DD');
    const days = target.daysInMonth();

    employee.dates = await this.adminCommonService.getAttendanceOne(
      employeeItem.id,
      start_at,
      end_at,
    );

    const rows = [];
    const dates = getDates(start_at, days, true);
    const attendance = JSON.parse(JSON.stringify(employee));

    dates.map((date) => {
      rows.push([
        date.format('ddd DD/MM/YYYY'),
        getClockIn(date, attendance['dates']),
        getClockOut(date, attendance['dates']),
        calculateDailyHoursWorked(date, attendance['dates']),
        calculateDailyActualHours(date, attendance['dates']),
        calculateDailyUnderTime(date, attendance['dates']),
        calculateDailyOverTime(date, attendance['dates']),
      ]);
    });

    const realPageSize = 530;
    const doc = new PDFDocument({ margin: 31.14, size: 'A4' });
    // A4 595.28 x 841.89 (portrait) (about width sizes)
    doc.moveDown(2);
    doc.fontSize(12).font('Helvetica-Bold').fillColor('#4A4A4B');
    doc.text(
      'RECORD OF ATTENDANCE FOR PURPOSES OF DEDUCTING \nPAY FOR UNAUTHORIZED ABSENCE (PAYROLL CODE – LWOP)',
      {
        align: 'center',
        underline: true,
      },
    );
    doc.text(`SPECIAL GENERAL ORDER NO.11 OF 2019`, { align: 'center', underline: true });
    doc.moveDown(1);
    doc.text(`AGENCY NAME: ${admin_location.admin_desc}`, { align: 'center' });
    doc.moveDown(1);
    switch (accountLevel) {
      case 1:
        // admin no desc
        doc.text(`Division: ${account_where}`, { align: 'center' });
        doc.moveDown();
        break;
      case 2:
        // paypoint desc
        doc.text(`Division: ${account_where}        Branch: ${paypoint_where}`, {
          align: 'center',
        });
        doc.moveDown();
        break;
    }
    doc.text(`Staff Attendance Report for month of ${target.format('MMMM YYYY')}`, {
      align: 'center',
    });
    doc.moveDown(1);
    const officerTable = {
      headers: [
        getTableNameHeaderOption('start'),
        getTableNameHeaderOption('start'),
        getTableNameHeaderOption('start'),
        getTableNameHeaderOption('start'),
        getTableNameHeaderOption('start'),
        getTableNameHeaderOption('start'),
      ],
    };
    officerTable['rows'] = [
      [
        'Name of officer:',
        normalizeReportName(employee['name_report']),
        '',
        'Payroll File Number:',
        employee['employee_no'],
      ],
    ];
    await doc.table(officerTable, {
      prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
        const { x, y, width, height } = rectCell;
        if (indexRow === 0) {
          if (indexColumn === 1 || indexColumn === 4) {
            doc
              .lineWidth(0.5)
              .moveTo(x, y + height)
              .lineTo(x + width, y + height)
              .stroke();
          }
        }
        doc.font('Helvetica-Bold');
        doc.fontSize(12);
        doc.fillColor('#4A4A4B');
      },
      divider: {
        header: { disabled: true },
        horizontal: { disabled: true },
      },
      columnSpacing: 0,
      hideHeader: true,
      width: realPageSize,
      columnsSize: [100, 145, 20, 120, 145],
    });
    doc.moveDown(1);

    const table = {
      headers: [
        getTableIndividualHeaderOption('Day', 'day', 'start'),
        getTableIndividualHeaderOption('Clock-in', 'clock_in', 'center'),
        getTableIndividualHeaderOption('Clock-out', 'clock_out', 'center'),
        getTableIndividualHeaderOption('Hrs Worked', 'hrs_worked', 'center'),
        getTableIndividualHeaderOption('Actual Hours', 'actual_worked', 'center'),
        getTableIndividualHeaderOption('Under Time', 'under_time', 'center'),
        getTableIndividualHeaderOption('Overtime', 'over_time', 'center'),
      ],
    };
    table['rows'] = rows;
    await doc.table(table, {
      prepareHeader: () => doc.font('Helvetica-Bold').fontSize(10),
      prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
        doc.font('Helvetica');
        doc.fontSize(10);
      },
      columnSpacing: 0,
      padding: 0,
      divider: {
        header: { disabled: true },
        horizontal: { disabled: true },
      },
      columnsSize: [
        getColumnWidth(realPageSize, 16), // 15%
        getColumnWidth(realPageSize, 14), // 15%
        getColumnWidth(realPageSize, 14), // 15%
        getColumnWidth(realPageSize, 14), // 15%
        getColumnWidth(realPageSize, 14), // 15%
        getColumnWidth(realPageSize, 14), // 15%
        getColumnWidth(realPageSize, 14), // 15%
      ],
    });
    doc.moveDown(1);
    doc.fontSize(12).font('Helvetica-Bold').fillColor('#4A4A4B');
    doc.text(`Total Under Time Hours: ${calculatePeriodUnderTime(dates, attendance['dates'])}`);
    doc.text(`Total Overtime Hours: ${calculatePeriodOverTime(dates, attendance['dates'])}`);
    doc.text(`Total Saturday Hours: ${calculatePeriodSaturdayHours(dates, attendance['dates'])}`);
    doc.text(`Total Sunday Hours: ${calculatePeriodSundayHours(dates, attendance['dates'])}`);
    doc.moveDown(1);

    doc.text('Report produced by PNG Time Access WoG Cloud Attendance System', { align: 'center' });
    doc.moveDown(1);
    doc.pipe(res);
    doc.end();
  }

  async printEmployeeFortnightly(
    user_id: number,
    params: ReportEmployeeFortnightlyDto,
    res: Response,
  ) {
    const { admin_location_id, employee_no, pay_no } = params;
    const user = await this.userRepo.findOne(user_id, {
      relations: ['userDetail', 'admin_location'],
    });
    if (!user) {
      throw new HttpException('User with that id not exists', HttpStatus.BAD_REQUEST);
    }
    let admin_id = admin_location_id;
    if (user.admin_location_id != null) {
      admin_id = user.admin_location_id;
    }
    // check admin_location
    const admin_location = await this.adminCommonService.getAdminLocationById(admin_id);
    if (!admin_location) {
      throw new HttpException('Admin location does not exist', HttpStatus.BAD_REQUEST);
    }

    let accountLevel = 0; //0: Super admin, 1: Account No Desc User, 2: Paypoint Desc user
    let account_where = '';
    let paypoint_where = '';
    if (user.admin_location_level_user == ADMIN_LOCATION_LEVEL_USER.ACCOUNT_NO_DESC_USER) {
      account_where = user.userDetail.account_no_desc;
      accountLevel = 1;
    }
    if (user.admin_location_level_user == ADMIN_LOCATION_LEVEL_USER.PAYPOINT_DESC_USER) {
      account_where = user.userDetail.account_no_desc;
      paypoint_where = user.userDetail.paypoint_desc;
      accountLevel = 2;
    }
    const employeeBuilder = await this.employeeRepo.createQueryBuilder();
    employeeBuilder
      .where('employee_no = :no', { no: employee_no })
      .andWhere('admin_location_id = :id', { id: admin_location_id });
    if (account_where != '') {
      employeeBuilder.andWhere('account_no_desc = :account', { account: account_where });
    }
    if (paypoint_where != '') {
      employeeBuilder.andWhere('paypoint_desc = :paypoint', { paypoint: paypoint_where });
    }

    const employeeItem = await employeeBuilder.getOne();
    if (!employeeItem) {
      throw new HttpException('Employee with that no not exists', HttpStatus.BAD_REQUEST);
    }

    let payloadWhere = {};
    if (pay_no === -1) {
      payloadWhere = {
        start_at: LessThanOrEqual(new Date()),
        end_at: MoreThanOrEqual(new Date()),
      };
    } else {
      payloadWhere = {
        id: pay_no,
      };
    }

    const payload = await this.payloadRepo.findOne({
      where: payloadWhere,
    });
    if (!payload) {
      throw new HttpException('Payload not found', HttpStatus.BAD_REQUEST);
    }
    const employee = {
      id: employeeItem.id,
      employee_no: employeeItem.employee_no,
      name_report: employeeItem.name_report,
      occup_pos_title: employeeItem.occup_pos_title,
      admin_desc: admin_location.admin_desc,
      dates: {},
    };
    employee.dates = await this.adminCommonService.getAttendanceOne(
      employeeItem.id,
      moment(payload.start_at, 'YYYY-MM-DD').format('YYYY-MM-DD'),
      moment(payload.end_at, 'YYYY-MM-DD').format('YYYY-MM-DD'),
    );
    const rows = [];
    const dates = getDates(payload.start_at, 14, true);
    const attendance = JSON.parse(JSON.stringify(employee));

    dates.map((date) => {
      rows.push([
        date.format('ddd DD/MM/YYYY'),
        getClockIn(date, attendance['dates']),
        getClockOut(date, attendance['dates']),
        calculateDailyHoursWorked(date, attendance['dates']),
        calculateDailyActualHours(date, attendance['dates']),
        calculateDailyUnderTime(date, attendance['dates']),
        calculateDailyOverTime(date, attendance['dates']),
      ]);
    });
    const realPageSize = 530;
    const doc = new PDFDocument({ margin: 31.14, size: 'A4' });
    // A4 595.28 x 841.89 (portrait) (about width sizes)
    doc.moveDown(2);
    doc.fontSize(12).font('Helvetica-Bold').fillColor('#4A4A4B');
    doc.text(
      'RECORD OF ATTENDANCE FOR PURPOSES OF DEDUCTING \nPAY FOR UNAUTHORIZED ABSENCE (PAYROLL CODE – LWOP)',
      {
        align: 'center',
        underline: true,
      },
    );
    doc.text(`SPECIAL GENERAL ORDER NO.11 OF 2019`, { align: 'center', underline: true });
    doc.moveDown(1);
    doc.text(`AGENCY NAME: ${admin_location.admin_desc}`, { align: 'center' });
    doc.moveDown(1);
    switch (accountLevel) {
      case 1:
        // admin no desc
        doc.text(`Division: ${account_where}`, { align: 'center' });
        doc.moveDown();
        break;
      case 2:
        // paypoint desc
        doc.text(`Division: ${account_where}        Branch: ${paypoint_where}`, {
          align: 'center',
        });
        doc.moveDown();
        break;
    }
    doc.text(
      'Staff Attendance Report for Pay No.' +
        payload.pay_no +
        ` (${moment.utc(payload.start_at).format('ddd DD/MM/YYYY')} to ${moment
          .utc(payload.end_at)
          .format('ddd DD/MM/YYYY')})`,
      { align: 'center' },
    );
    doc.moveDown(1);

    const officerTable = {
      headers: [
        getTableNameHeaderOption('start'),
        getTableNameHeaderOption('start'),
        getTableNameHeaderOption('start'),
        getTableNameHeaderOption('start'),
        getTableNameHeaderOption('start'),
        getTableNameHeaderOption('start'),
      ],
    };

    officerTable['rows'] = [
      [
        'Name of officer:',
        normalizeReportName(employee['name_report']),
        '',
        'Payroll File Number:',
        employee['employee_no'],
      ],
    ];

    await doc.table(officerTable, {
      prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
        const { x, y, width, height } = rectCell;
        if (indexRow === 0) {
          if (indexColumn === 1 || indexColumn === 4) {
            doc
              .lineWidth(0.5)
              .moveTo(x, y + height)
              .lineTo(x + width, y + height)
              .stroke();
          }
        }
        doc.font('Helvetica-Bold');
        doc.fontSize(12);
        doc.fillColor('#4A4A4B');
      },
      divider: {
        header: { disabled: true },
        horizontal: { disabled: true },
      },
      columnSpacing: 0,
      hideHeader: true,
      width: realPageSize,
      columnsSize: [100, 145, 20, 120, 145],
    });

    doc.moveDown(1);

    const table = {
      headers: [
        getTableIndividualHeaderOption('Day', 'day', 'start'),
        getTableIndividualHeaderOption('Clock-in', 'clock_in', 'center'),
        getTableIndividualHeaderOption('Clock-out', 'clock_out', 'center'),
        getTableIndividualHeaderOption('Hrs Worked', 'hrs_worked', 'center'),
        getTableIndividualHeaderOption('Actual Hours', 'actual_worked', 'center'),
        getTableIndividualHeaderOption('Under Time', 'under_time', 'center'),
        getTableIndividualHeaderOption('Overtime', 'over_time', 'center'),
      ],
    };
    table['rows'] = rows;
    await doc.table(table, {
      prepareHeader: () => doc.font('Helvetica-Bold').fontSize(10),
      prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
        doc.font('Helvetica');
        doc.fontSize(10);
      },
      columnSpacing: 0,
      padding: 0,
      divider: {
        header: { disabled: true },
        horizontal: { disabled: true },
      },
      columnsSize: [
        getColumnWidth(realPageSize, 16), // 15%
        getColumnWidth(realPageSize, 14), // 15%
        getColumnWidth(realPageSize, 14), // 15%
        getColumnWidth(realPageSize, 14), // 15%
        getColumnWidth(realPageSize, 14), // 15%
        getColumnWidth(realPageSize, 14), // 15%
        getColumnWidth(realPageSize, 14), // 15%
      ],
    });

    doc.moveDown();
    doc.fontSize(12).font('Helvetica-Bold');
    doc.text(`Total Under Time Hours: ${calculatePeriodUnderTime(dates, attendance['dates'])}`);
    doc.text(`Total Overtime Hours: ${calculatePeriodOverTime(dates, attendance['dates'])}`);
    doc.text(`Total Saturday Hours: ${calculatePeriodSaturdayHours(dates, attendance['dates'])}`);
    doc.text(`Total Sunday Hours: ${calculatePeriodSundayHours(dates, attendance['dates'])}`);
    doc.text(
      `No of days authorized for Pay Docking: ${calculatePayDockingDays(
        dates,
        attendance['dates'],
      )}`,
    );
    doc.moveDown();
    const signedTable = {
      headers: [
        getTableNameHeaderOption('start'),
        getTableNameHeaderOption('center'),
        getTableNameHeaderOption('start'),
        getTableNameHeaderOption('start'),
        getTableNameHeaderOption('center'),
        getTableNameHeaderOption('center'),
      ],
    };
    signedTable['rows'] = [
      ['Certified By:', '', '', 'Date:', ''],
      ['', 'HR Delegate', '', '', ''],
      ['Approved By:', '', '', 'Date:', ''],
      ['', 'Agency Head Delegate', '', '', ''],
      ['Processed By:', '', '', 'Date:', ''],
      ['', 'Name of Officer', '', '', ''],
    ];
    await doc.table(signedTable, {
      prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
        const { x, y, width, height } = rectCell;
        if (indexRow === 0) {
          if (indexColumn === 1 || indexColumn === 4) {
            doc
              .lineWidth(0.5)
              .moveTo(x, y + height)
              .lineTo(x + width, y + height)
              .stroke();
          }
        }
        if (indexRow === 2) {
          if (indexColumn === 1 || indexColumn === 4) {
            doc
              .lineWidth(0.5)
              .moveTo(x, y + height)
              .lineTo(x + width, y + height)
              .stroke();
          }
        }
        if (indexRow === 4) {
          if (indexColumn === 1 || indexColumn === 4) {
            doc
              .lineWidth(0.5)
              .moveTo(x, y + height)
              .lineTo(x + width, y + height)
              .stroke();
          }
        }
        doc.font('Helvetica-Bold');
        doc.fontSize(12);
        doc.fillColor('#4A4A4B');
      },
      divider: {
        header: { disabled: true },
        horizontal: { disabled: true },
      },
      columnSpacing: 7,
      hideHeader: true,
      width: realPageSize,
      columnsSize: [90, 230, 20, 40, 150],
    });
    doc.moveDown();
    doc.text('Report produced by PNG Time Access WoG Cloud Attendance System', { align: 'center' });

    doc.pipe(res);
    doc.end();
  }
}
