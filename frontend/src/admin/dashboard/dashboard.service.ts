import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AdminCommonService } from '../admin-common/admin-common.service';
import { InjectRepository } from '@nestjs/typeorm';
import { EmployeeEntity } from '../../database/entities/employee.entity';
import { Brackets, Repository } from 'typeorm';
import { AdminLocationEntity } from '../../database/entities/admin_location.entity';
import { UserEntity } from '../../database/entities/user.entity';
import { UserDetailEntity } from '../../database/entities/user-detail.entity';
import { DeviceEntity } from '../../database/entities/device.entity';
import { ACCESS_PRIVILEGE, ADMIN_LOCATION_LEVEL_USER, USER_TYPE } from '../../utils/const';
import { GetDashboardEmployeesDto } from './dto/get-dashboard-employees.dto';
import { Sort, SortType } from '../../type/pageable';
import { calculateAge } from '../../utils/helper';

@Injectable()
export class DashboardService {
  constructor(
    private readonly adminCommonService: AdminCommonService,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(UserDetailEntity)
    private readonly userDetailRep: Repository<UserDetailEntity>,
    @InjectRepository(DeviceEntity)
    private readonly deviceRepo: Repository<DeviceEntity>,
    @InjectRepository(EmployeeEntity)
    private readonly employeeRepo: Repository<EmployeeEntity>,
    @InjectRepository(AdminLocationEntity)
    private readonly adminLocationRepo: Repository<AdminLocationEntity>,
  ) {}

  async getSummary(user_id: number) {
    const user = await this.userRepo.findOne(user_id, {
      relations: ['userDetail', 'admin_location'],
    });
    if (!user) {
      throw new HttpException('User with that id not exists', HttpStatus.BAD_REQUEST);
    }
    let users_count = 0;
    let employees_count = 0;
    let device_count = 0;

    //--------------USER SUMMARY-----------------
    const user_builder = this.userRepo.createQueryBuilder('user');
    if (
      user.access_privilege != null &&
      ![
        ACCESS_PRIVILEGE.SUPER_USER.toString(),
        ACCESS_PRIVILEGE.BUREAUCRAT_USER.toString(),
      ].includes(user.access_privilege)
    ) {
      user_builder.andWhere('ua.user_type = :type', {
        type:
          user.access_privilege == ACCESS_PRIVILEGE.TEACHER_USER
            ? USER_TYPE.TEACHER
            : USER_TYPE.NON_TEACHER,
      });
    }
    if (user.admin_location != null) {
      user_builder.andWhere('user.admin_location_id = :id', { id: user.admin_location_id });
      if (
        user.admin_location_level_user == ADMIN_LOCATION_LEVEL_USER.ACCOUNT_NO_DESC_USER ||
        user.admin_location_level_user == ADMIN_LOCATION_LEVEL_USER.PAYPOINT_DESC_USER
      ) {
        user_builder.andWhere('user.id = :user_id', { user_id: user_id });
      }
    }
    user_builder
      .leftJoinAndSelect('user.userDetail', 'ud')
      .leftJoinAndSelect('user.admin_location', 'ua');

    users_count = await user_builder.getCount();

    //--------------EMPLOYEE SUMMARY-----------------
    const employee_builder = this.employeeRepo.createQueryBuilder('employee');
    if (
      user.access_privilege != null &&
      ![
        ACCESS_PRIVILEGE.SUPER_USER.toString(),
        ACCESS_PRIVILEGE.BUREAUCRAT_USER.toString(),
      ].includes(user.access_privilege)
    ) {
      employee_builder.andWhere('ea.user_type = :type', {
        type:
          user.access_privilege == ACCESS_PRIVILEGE.TEACHER_USER
            ? USER_TYPE.TEACHER
            : USER_TYPE.NON_TEACHER,
      });
    }
    if (user.admin_location != null) {
      employee_builder.andWhere('employee.admin_location_id = :id', { id: user.admin_location_id });
      if (user.admin_location_level_user == ADMIN_LOCATION_LEVEL_USER.ACCOUNT_NO_DESC_USER) {
        employee_builder.andWhere('employee.account_no_desc = :account_desc', {
          account_desc: user.userDetail.account_no_desc,
        });
      }
      if (user.admin_location_level_user == ADMIN_LOCATION_LEVEL_USER.PAYPOINT_DESC_USER) {
        employee_builder.andWhere('employee.account_no_desc = :account_desc', {
          account_desc: user.userDetail.account_no_desc,
        });
        employee_builder.andWhere('employee.paypoint_desc = :paypoint_desc', {
          paypoint_desc: user.userDetail.paypoint_desc,
        });
      }
    }
    employee_builder
      .andWhere('employee.archived_at IS NULL')
      .leftJoinAndSelect('employee.admin_location', 'ea');
    employees_count = await employee_builder.getCount();

    //--------------DEVICE SUMMARY-----------------
    const device_builder = this.deviceRepo.createQueryBuilder('device');
    if (
      user.access_privilege != null &&
      ![
        ACCESS_PRIVILEGE.SUPER_USER.toString(),
        ACCESS_PRIVILEGE.BUREAUCRAT_USER.toString(),
      ].includes(user.access_privilege)
    ) {
      device_builder.andWhere('da.user_type = :type', {
        type:
          user.access_privilege == ACCESS_PRIVILEGE.TEACHER_USER
            ? USER_TYPE.TEACHER
            : USER_TYPE.NON_TEACHER,
      });
    }
    if (user.admin_location != null) {
      device_builder.andWhere('device.admin_location_id = :id', { id: user.admin_location_id });

      if (
        user.admin_location_level_user == ADMIN_LOCATION_LEVEL_USER.ACCOUNT_NO_DESC_USER ||
        user.admin_location_level_user == ADMIN_LOCATION_LEVEL_USER.PAYPOINT_DESC_USER
      ) {
        // set always zero
        device_builder.andWhere('device.id IS NULL');
      }
    }
    device_builder.leftJoinAndSelect('device.admin_location', 'da');
    device_count = await device_builder.getCount();

    return {
      status: 'ok',
      message: 'success',
      data: {
        user_summary: users_count,
        employee_summary: employees_count,
        device_summary: device_count,
      },
    };
  }

  async getDashboardEmployees(user_id: number, params: GetDashboardEmployeesDto) {
    const { search, limit, offset } = params;
    const user = await this.userRepo.findOne(user_id, {
      relations: ['userDetail', 'admin_location'],
    });
    if (!user) {
      throw new HttpException('User with that id not exists', HttpStatus.BAD_REQUEST);
    }
    const sort: Sort = {
      field: 'employee.id',
      order: SortType.ASC,
    };
    const builder = this.employeeRepo.createQueryBuilder('employee');
    if (search) {
      builder.where(
        new Brackets((subQuery) => {
          subQuery.orWhere(`employee.name_report LIKE '%${search}%'`);
          subQuery.orWhere(`employee.employee_no LIKE '%${search}%'`);
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
      builder.andWhere('employee.admin_location_id = :id', { id: user.admin_location_id });
      if (user.admin_location_level_user == ADMIN_LOCATION_LEVEL_USER.ACCOUNT_NO_DESC_USER) {
        builder.andWhere('employee.account_no_desc = :account_desc', {
          account_desc: user.userDetail.account_no_desc,
        });
      }
      if (user.admin_location_level_user == ADMIN_LOCATION_LEVEL_USER.PAYPOINT_DESC_USER) {
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
        user_type: item.admin_location.user_type,
        admin_location_id: item.admin_location_id,
        admin_location: item.admin_location.admin_location,
        admin_desc: item.admin_location.admin_desc,
        employee_no: item.employee_no,
        name_report: item.name_report,
        position_no: item.position_no,
        occup_pos_title: item.occup_pos_title,
        award: item.award,
        award_desc: item.award_desc,
        classification: item.classification,
        class_desc: item.class_desc,
        step_no: item.step_no,
        occup_type: item.occup_type,
        gender: item.gender,
        first_commence: item.first_commence,
        account_no: item.account_no,
        account_no_desc: item.account_no_desc,
        emp_status: item.emp_status,
        paypoint: item.paypoint,
        paypoint_desc: item.paypoint_desc,
        date_of_birth: item.date_of_birth,
        age: item.date_of_birth != null ? calculateAge(item.date_of_birth) : '',
        occup_pos_cat: item.occup_pos_cat,
      });
    });
    return { status: 'ok', message: 'success', rows: rows, count: count };
  }
}
