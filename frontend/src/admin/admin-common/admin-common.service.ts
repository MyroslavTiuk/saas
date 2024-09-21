import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../database/entities/user.entity';
import { Repository } from 'typeorm';
import { UserDetailEntity } from '../../database/entities/user-detail.entity';
import { PayloadEntity } from '../../database/entities/payload.entity';
import { EmployeeEntity } from '../../database/entities/employee.entity';
import { DeviceEntity } from '../../database/entities/device.entity';
import { AttendanceEntity } from '../../database/entities/attendance.entity';
import { AdminLocationEntity } from '../../database/entities/admin_location.entity';
import { Sort, SortType } from '../../type/pageable';
import {
  EmailVerifyCodeEntity,
  EmailVerifyType,
} from '../../database/entities/email-verify-code.entity';

@Injectable()
export class AdminCommonService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(UserDetailEntity)
    private readonly userDetailRepo: Repository<UserDetailEntity>,
    @InjectRepository(PayloadEntity)
    private readonly payloadRepo: Repository<PayloadEntity>,
    @InjectRepository(EmployeeEntity)
    private readonly employeeRepo: Repository<EmployeeEntity>,
    @InjectRepository(DeviceEntity)
    private readonly deviceRepo: Repository<DeviceEntity>,
    @InjectRepository(AttendanceEntity)
    private readonly attendanceRepo: Repository<AttendanceEntity>,
    @InjectRepository(AdminLocationEntity)
    private readonly adminLocationRepo: Repository<AdminLocationEntity>,
    @InjectRepository(EmailVerifyCodeEntity)
    private readonly emailVerifyCodeRepo: Repository<EmailVerifyCodeEntity>,
  ) {}

  async getUserById(user_id: number, withDelete = false): Promise<UserEntity | null> {
    const exist = await this.userRepo.findOne({
      withDeleted: withDelete,
      where: { id: user_id },
    });
    if (exist) {
      return exist;
    }
    return null;
  }

  async getUserByEmail(email: string): Promise<UserEntity | null> {
    const exist = await this.userRepo.findOne({
      where: { email: email.toLowerCase() },
    });
    if (exist) {
      return exist;
    }
    return null;
  }

  async getUserDetailByUserId(user_id: number): Promise<UserDetailEntity | null> {
    const exist = await this.userDetailRepo.findOne({
      where: { user_id: user_id },
    });
    if (exist) {
      return exist;
    }
    return null;
  }

  async getAdminLocationById(id: number): Promise<AdminLocationEntity | null> {
    const exist = await this.adminLocationRepo.findOne({
      where: { id },
    });
    if (exist) {
      return exist;
    }
    return null;
  }

  async getDeviceById(id: number): Promise<DeviceEntity | null> {
    const exist = await this.deviceRepo.findOne({
      where: { id },
    });
    if (exist) {
      return exist;
    }
    return null;
  }

  async getEmployeeById(id: number): Promise<EmployeeEntity | null> {
    const exist = await this.employeeRepo.findOne({
      where: { id },
    });
    if (exist) {
      return exist;
    }
    return null;
  }

  async getEmployeeByNo(employee_no: string): Promise<EmployeeEntity | null> {
    const exist = await this.employeeRepo.findOne({
      where: { employee_no },
    });
    if (exist) {
      return exist;
    }
    return null;
  }

  async getGeneralList(
    admin_location_id: number,
    account_no_desc: string,
    paypoint_desc: string,
    start_at: string,
    end_at: string,
  ) {
    const sort: Sort = {
      field: 'employee.name_report',
      order: SortType.ASC,
    };
    const builder = this.employeeRepo.createQueryBuilder('employee');
    builder.andWhere('employee.admin_location_id = :admin_location_id', { admin_location_id });
    builder
      .andWhere('employee.archived_at IS NULL')
      .leftJoinAndSelect('employee.admin_location', 'ead')
      .orderBy(sort.field, sort.order);
    if (account_no_desc != '') {
      builder.andWhere('employee.account_no_desc = :account_no_desc', {
        account_no_desc: account_no_desc,
      });
    }
    if (paypoint_desc != '') {
      builder.andWhere('employee.paypoint_desc = :paypoint_desc', { paypoint_desc: paypoint_desc });
    }

    const data = await builder.getMany();
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
    if (start_at != '' && end_at != '') {
      attendanceBuilder.andWhere('attendance.date >= :startDate', { startDate: start_at });
      attendanceBuilder.andWhere('attendance.date <= :endDate', { endDate: end_at });
    } else {
      attendanceBuilder.where('attendance.date = :date', { date: start_at });
    }
    attendanceBuilder
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
    return rows;
  }

  async getAttendanceOne(employee_id: number, start_at: string, end_at: string) {
    const attendanceBuilder = this.attendanceRepo.createQueryBuilder('attendance');
    if (start_at != '' && end_at != '') {
      attendanceBuilder.andWhere('attendance.date >= :startDate', { startDate: start_at });
      attendanceBuilder.andWhere('attendance.date <= :endDate', { endDate: end_at });
    } else {
      attendanceBuilder.where('attendance.date = :date', { date: start_at });
    }
    attendanceBuilder.andWhere('attendance.employee_id = :id', { id: employee_id });
    const dates = {};
    const attendances = await attendanceBuilder.getMany();
    attendances.map((time) => {
      dates[`${time.date}`] = {
        clocked_in: time.clocked_in,
        clocked_out: time.clocked_out,
        worked_hours: time.worked_hours,
      };
    });
    return dates;
  }

  async getUserEmailVerifyToken(
    email: string,
    type: EmailVerifyType,
  ): Promise<EmailVerifyCodeEntity | null> {
    const exist = await this.emailVerifyCodeRepo.findOne({
      where: {
        email: email,
        type: type,
      },
      order: { id: 'DESC' },
    });
    if (exist) {
      return exist;
    }
    return null;
  }
}
