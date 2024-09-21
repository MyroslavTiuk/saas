import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AdminCommonService } from '../admin-common/admin-common.service';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../database/entities/user.entity';
import { Brackets, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { UserDetailEntity } from '../../database/entities/user-detail.entity';
import { PayloadEntity } from '../../database/entities/payload.entity';
import { EmployeeEntity } from '../../database/entities/employee.entity';
import { AttendanceEntity } from '../../database/entities/attendance.entity';
import { AdminLocationEntity } from '../../database/entities/admin_location.entity';
import { GetDailyDto } from './dto/get-daily.dto';
import { ACCESS_PRIVILEGE, ADMIN_LOCATION_LEVEL_USER, USER_TYPE } from '../../utils/const';
import { Sort, SortType } from '../../type/pageable';
import { GetWeeklyDto } from './dto/get-weekly.dto';
import moment from 'moment';
import { GetMonthlyDto } from './dto/get-monthly.dto';
import { GetFortnightlyDto } from './dto/get-fortnightly.dto';

@Injectable()
export class AttendanceService {
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

  async getAttendancesDaily(user_id: number, params: GetDailyDto) {
    const { admin_location_id, offset, limit, search, date } = params;
    let adLocationId = admin_location_id;
    const user = await this.userRepo.findOne(user_id, {
      relations: ['userDetail', 'admin_location'],
    });
    if (!user) {
      throw new HttpException('User with that id not exists', HttpStatus.BAD_REQUEST);
    }
    if (user.admin_location_id != null) {
      adLocationId = user.admin_location_id;
    }
    const sort: Sort = {
      field: 'employee.name_report',
      order: SortType.ASC,
    };

    const builder = this.employeeRepo.createQueryBuilder('employee');
    builder.andWhere('employee.admin_location_id = :admin_location_id', {
      admin_location_id: adLocationId,
    });
    if (search) {
      builder.where(
        new Brackets((subQuery) => {
          subQuery.orWhere(`employee.employee_no LIKE '%${search}%'`);
          subQuery.orWhere(`employee.name_report LIKE '%${search}%'`);
          subQuery.orWhere(`ea.admin_desc LIKE '%${search}%'`);
        }),
      );
    }
    if (user.access_privilege != null && user.access_privilege != ACCESS_PRIVILEGE.SUPER_USER) {
      builder.andWhere('ea.user_type = :type', {
        type:
          user.access_privilege == ACCESS_PRIVILEGE.TEACHER_USER
            ? USER_TYPE.TEACHER
            : USER_TYPE.NON_TEACHER,
      });
    }
    if (user.admin_location != null) {
      if (user.admin_location_level_user == ADMIN_LOCATION_LEVEL_USER.ACCOUNT_NO_DESC_USER) {
        builder.andWhere('employee.account_no_desc = :account_desc', {
          account_desc: user.userDetail.account_no_desc,
        });
      }
      if (user.admin_location_level_user == ADMIN_LOCATION_LEVEL_USER.PAYPOINT_DESC_USER) {
        builder.andWhere('employee.account_no_desc = :account_desc', {
          account_desc: user.userDetail.account_no_desc,
        });
        builder.andWhere('employee.paypoint_desc = :paypoint_desc', {
          paypoint_desc: user.userDetail.paypoint_desc,
        });
      }
    }
    builder
      .andWhere('employee.archived_at IS NULL')
      .leftJoinAndSelect('employee.admin_location', 'ea')
      .orderBy(sort.field, sort.order)
      .offset(offset)
      .limit(limit);

    const [data, count] = await builder.getManyAndCount();
    const rows = [];
    data.map((item) => {
      rows.push({
        id: item.id,
        employee_no: item.employee_no,
        name_report: item.name_report,
        occup_pos_title: item.occup_pos_title,
        admin_desc: item.admin_location.admin_desc,
        dates: {},
      });
    });
    const attendanceBuilder = this.attendanceRepo.createQueryBuilder('attendance');
    attendanceBuilder
      .where('attendance.date = :date', { date: date })
      .andWhere('admin.id = :id', { id: admin_location_id })
      .leftJoin('attendance.employee', 'emp')
      .leftJoinAndSelect('emp.admin_location', 'admin');
    const attendances = await attendanceBuilder.getMany();

    rows.map((item) => {
      const times = attendances.filter((obj) => obj.employee_id == item.id);
      times.map((time) => {
        item.dates[`${time.date}`] = {
          clocked_in: time.clocked_in,
          clocked_out: time.clocked_out,
          worked_hours: time.worked_hours,
        };
      });
    });

    return { status: 'ok', message: 'success', rows: rows, count: count };
  }

  async getAttendancesWeekly(user_id: number, params: GetWeeklyDto) {
    const { admin_location_id, offset, limit, search, date } = params;
    let adLocationId = admin_location_id;
    const user = await this.userRepo.findOne(user_id, {
      relations: ['userDetail', 'admin_location'],
    });
    if (!user) {
      throw new HttpException('User with that id not exists', HttpStatus.BAD_REQUEST);
    }
    if (user.admin_location_id != null) {
      adLocationId = user.admin_location_id;
    }
    const sort: Sort = {
      field: 'employee.name_report',
      order: SortType.ASC,
    };
    const builder = this.employeeRepo.createQueryBuilder('employee');
    builder.andWhere('employee.admin_location_id = :admin_location_id', {
      admin_location_id: adLocationId,
    });
    if (search) {
      builder.where(
        new Brackets((subQuery) => {
          subQuery.orWhere(`employee.employee_no LIKE '%${search}%'`);
          subQuery.orWhere(`employee.name_report LIKE '%${search}%'`);
          subQuery.orWhere(`ea.admin_desc LIKE '%${search}%'`);
        }),
      );
    }
    if (user.access_privilege != null && user.access_privilege != ACCESS_PRIVILEGE.SUPER_USER) {
      builder.andWhere('ea.user_type = :type', {
        type:
          user.access_privilege == ACCESS_PRIVILEGE.TEACHER_USER
            ? USER_TYPE.TEACHER
            : USER_TYPE.NON_TEACHER,
      });
    }
    if (user.admin_location != null) {
      if (user.admin_location_level_user == ADMIN_LOCATION_LEVEL_USER.ACCOUNT_NO_DESC_USER) {
        builder.andWhere('employee.account_no_desc = :account_desc', {
          account_desc: user.userDetail.account_no_desc,
        });
      }
      if (user.admin_location_level_user == ADMIN_LOCATION_LEVEL_USER.PAYPOINT_DESC_USER) {
        builder.andWhere('employee.account_no_desc = :account_desc', {
          account_desc: user.userDetail.account_no_desc,
        });
        builder.andWhere('employee.paypoint_desc = :paypoint_desc', {
          paypoint_desc: user.userDetail.paypoint_desc,
        });
      }
    }
    builder
      .andWhere('employee.archived_at IS NULL')
      .leftJoinAndSelect('employee.admin_location', 'ea')
      .orderBy(sort.field, sort.order)
      .offset(offset)
      .limit(limit);

    const [data, count] = await builder.getManyAndCount();
    const rows = [];
    data.map((item) => {
      rows.push({
        id: item.id,
        employee_no: item.employee_no,
        name_report: item.name_report,
        occup_pos_title: item.occup_pos_title,
        admin_desc: item.admin_location.admin_desc,
        dates: {},
      });
    });

    const target = moment(date, 'YYYY-MM-DD');
    const start_at = target.weekday(1).format('YYYY-MM-DD');
    const end_at = moment(start_at, 'YYYY-MM-DD').add(6, 'days').format('YYYY-MM-DD');
    const attendanceBuilder = this.attendanceRepo.createQueryBuilder('attendance');
    attendanceBuilder
      .andWhere('attendance.date >= :startDate', { startDate: start_at })
      .andWhere('attendance.date <= :endDate', { endDate: end_at })
      .andWhere('admin.id = :id', { id: admin_location_id })
      .leftJoin('attendance.employee', 'emp')
      .leftJoinAndSelect('emp.admin_location', 'admin');
    const attendances = await attendanceBuilder.getMany();

    rows.map((item) => {
      const times = attendances.filter((obj) => obj.employee_id == item.id);
      times.map((time) => {
        item.dates[`${time.date}`] = {
          clocked_in: time.clocked_in,
          clocked_out: time.clocked_out,
          worked_hours: time.worked_hours,
        };
      });
    });

    return {
      status: 'ok',
      message: 'success',
      rows: rows,
      count: count,
      weekload: { start_at: start_at, end_at: end_at },
    };
  }

  async getAttendancesMonthly(user_id: number, params: GetMonthlyDto) {
    const { admin_location_id, offset, limit, search, date } = params;
    let adLocationId = admin_location_id;
    const user = await this.userRepo.findOne(user_id, {
      relations: ['userDetail', 'admin_location'],
    });
    if (!user) {
      throw new HttpException('User with that id not exists', HttpStatus.BAD_REQUEST);
    }
    if (user.admin_location_id != null) {
      adLocationId = user.admin_location_id;
    }
    const sort: Sort = {
      field: 'employee.name_report',
      order: SortType.ASC,
    };
    const builder = this.employeeRepo.createQueryBuilder('employee');
    builder.andWhere('employee.admin_location_id = :admin_location_id', {
      admin_location_id: adLocationId,
    });
    if (search) {
      builder.where(
        new Brackets((subQuery) => {
          subQuery.orWhere(`employee.employee_no LIKE '%${search}%'`);
          subQuery.orWhere(`employee.name_report LIKE '%${search}%'`);
          subQuery.orWhere(`ea.admin_desc LIKE '%${search}%'`);
        }),
      );
    }
    if (user.access_privilege != null && user.access_privilege != ACCESS_PRIVILEGE.SUPER_USER) {
      builder.andWhere('ea.user_type = :type', {
        type:
          user.access_privilege == ACCESS_PRIVILEGE.TEACHER_USER
            ? USER_TYPE.TEACHER
            : USER_TYPE.NON_TEACHER,
      });
    }
    if (user.admin_location != null) {
      if (user.admin_location_level_user == ADMIN_LOCATION_LEVEL_USER.ACCOUNT_NO_DESC_USER) {
        builder.andWhere('employee.account_no_desc = :account_desc', {
          account_desc: user.userDetail.account_no_desc,
        });
      }
      if (user.admin_location_level_user == ADMIN_LOCATION_LEVEL_USER.PAYPOINT_DESC_USER) {
        builder.andWhere('employee.account_no_desc = :account_desc', {
          account_desc: user.userDetail.account_no_desc,
        });
        builder.andWhere('employee.paypoint_desc = :paypoint_desc', {
          paypoint_desc: user.userDetail.paypoint_desc,
        });
      }
    }
    builder
      .andWhere('employee.archived_at IS NULL')
      .leftJoinAndSelect('employee.admin_location', 'ea')
      .orderBy(sort.field, sort.order)
      .offset(offset)
      .limit(limit);

    const [data, count] = await builder.getManyAndCount();
    const rows = [];
    data.map((item) => {
      rows.push({
        id: item.id,
        employee_no: item.employee_no,
        name_report: item.name_report,
        occup_pos_title: item.occup_pos_title,
        admin_desc: item.admin_location.admin_desc,
        dates: {},
      });
    });

    const target = moment(date, 'YYYY-MM-DD');
    const start_at = target.startOf('month').format('YYYY-MM-DD');
    const end_at = target.endOf('month').format('YYYY-MM-DD');
    const days = target.daysInMonth();

    const attendanceBuilder = this.attendanceRepo.createQueryBuilder('attendance');
    attendanceBuilder
      .andWhere('attendance.date >= :startDate', { startDate: start_at })
      .andWhere('attendance.date <= :endDate', { endDate: end_at })
      .andWhere('admin.id = :id', { id: admin_location_id })
      .leftJoin('attendance.employee', 'emp')
      .leftJoinAndSelect('emp.admin_location', 'admin');
    const attendances = await attendanceBuilder.getMany();

    rows.map((item) => {
      const times = attendances.filter((obj) => obj.employee_id == item.id);
      times.map((time) => {
        item.dates[`${time.date}`] = {
          clocked_in: time.clocked_in,
          clocked_out: time.clocked_out,
          worked_hours: time.worked_hours,
        };
      });
    });

    return {
      status: 'ok',
      message: 'success',
      rows: rows,
      count: count,
      monthload: { start_at: start_at, end_at: end_at, days: days },
    };
  }

  async getAttendancesFortnightly(user_id: number, params: GetFortnightlyDto) {
    const { admin_location_id, offset, limit, search, pay_no } = params;
    let adLocationId = admin_location_id;
    const user = await this.userRepo.findOne(user_id, {
      relations: ['userDetail', 'admin_location'],
    });
    if (!user) {
      throw new HttpException('User with that id not exists', HttpStatus.BAD_REQUEST);
    }
    if (user.admin_location_id != null) {
      adLocationId = user.admin_location_id;
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

    const sort: Sort = {
      field: 'employee.name_report',
      order: SortType.ASC,
    };
    const builder = this.employeeRepo.createQueryBuilder('employee');
    builder.andWhere('employee.admin_location_id = :admin_location_id', {
      admin_location_id: adLocationId,
    });
    if (search) {
      builder.where(
        new Brackets((subQuery) => {
          subQuery.orWhere(`employee.employee_no LIKE '%${search}%'`);
          subQuery.orWhere(`employee.name_report LIKE '%${search}%'`);
          subQuery.orWhere(`ea.admin_desc LIKE '%${search}%'`);
        }),
      );
    }
    if (user.access_privilege != null && user.access_privilege != ACCESS_PRIVILEGE.SUPER_USER) {
      builder.andWhere('ea.user_type = :type', {
        type:
          user.access_privilege == ACCESS_PRIVILEGE.TEACHER_USER
            ? USER_TYPE.TEACHER
            : USER_TYPE.NON_TEACHER,
      });
    }
    if (user.admin_location != null) {
      if (user.admin_location_level_user == ADMIN_LOCATION_LEVEL_USER.ACCOUNT_NO_DESC_USER) {
        builder.andWhere('employee.account_no_desc = :account_desc', {
          account_desc: user.userDetail.account_no_desc,
        });
      }
      if (user.admin_location_level_user == ADMIN_LOCATION_LEVEL_USER.PAYPOINT_DESC_USER) {
        builder.andWhere('employee.account_no_desc = :account_desc', {
          account_desc: user.userDetail.account_no_desc,
        });
        builder.andWhere('employee.paypoint_desc = :paypoint_desc', {
          paypoint_desc: user.userDetail.paypoint_desc,
        });
      }
    }
    builder
      .andWhere('employee.archived_at IS NULL')
      .leftJoinAndSelect('employee.admin_location', 'ea')
      .orderBy(sort.field, sort.order)
      .offset(offset)
      .limit(limit);

    const [data, count] = await builder.getManyAndCount();
    const rows = [];
    data.map((item) => {
      rows.push({
        id: item.id,
        employee_no: item.employee_no,
        name_report: item.name_report,
        occup_pos_title: item.occup_pos_title,
        admin_desc: item.admin_location.admin_desc,
        dates: {},
      });
    });

    const start_at = payload.start_at;
    const end_at = payload.end_at;
    const attendanceBuilder = this.attendanceRepo.createQueryBuilder('attendance');
    attendanceBuilder
      .andWhere('attendance.date >= :startDate', { startDate: start_at })
      .andWhere('attendance.date <= :endDate', { endDate: end_at })
      .andWhere('admin.id = :id', { id: admin_location_id })
      .leftJoin('attendance.employee', 'emp')
      .leftJoinAndSelect('emp.admin_location', 'admin');
    const attendances = await attendanceBuilder.getMany();

    rows.map((item) => {
      const times = attendances.filter((obj) => obj.employee_id == item.id);
      times.map((time) => {
        item.dates[`${time.date}`] = {
          clocked_in: time.clocked_in,
          clocked_out: time.clocked_out,
          worked_hours: time.worked_hours,
        };
      });
    });

    return {
      status: 'ok',
      message: 'success',
      rows: rows,
      count: count,
      payload: payload,
    };
  }
}
