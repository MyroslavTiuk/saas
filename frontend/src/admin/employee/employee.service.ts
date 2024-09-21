import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AdminCommonService } from '../admin-common/admin-common.service';
import { InjectRepository } from '@nestjs/typeorm';
import { EmployeeEntity } from '../../database/entities/employee.entity';
import { Brackets, IsNull, Not, Repository } from 'typeorm';
import { AdminLocationEntity } from '../../database/entities/admin_location.entity';
import { GetAccountNoDescListDto } from './dto/get-account-no-desc-list.dto';
import { GetPaypointDescListDto } from './dto/get-paypoint-desc-list.dto';
import { GetEmployeesDto } from './dto/get-employees.dto';
import { Sort, SortType } from '../../type/pageable';
import { UserEntity } from '../../database/entities/user.entity';
import { AddEmployeeDto } from './dto/add-employee.dto';
import { GetEmployeeByNoDto } from './dto/get-employee-by-no.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { DeleteEmployeeDto } from './dto/delete-employee.dto';
import { ChangeEmployeeStatusDto } from './dto/change-employee-status.dto';
import { EmployeeArchiveFileDto } from './dto/employee-archive-file.dto';
import { EmployeeArchiveDto } from './dto/employee-archive.dto';
import { GetArchivedEmployeesDto } from './dto/get-archived-employees.dto';
import { EmployeeAvatarDto } from './dto/employee-avatar.dto';
import { calculateAge } from '../../utils/helper';
import { ADMIN_LOCATION_LEVEL_USER } from '../../utils/const';
import { UserDetailEntity } from '../../database/entities/user-detail.entity';

@Injectable()
export class EmployeeService {
  constructor(
    private readonly adminCommonService: AdminCommonService,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(UserDetailEntity)
    private readonly userDetailRep: Repository<UserDetailEntity>,
    @InjectRepository(EmployeeEntity)
    private readonly employeeRepo: Repository<EmployeeEntity>,
    @InjectRepository(AdminLocationEntity)
    private readonly adminLocationRepo: Repository<AdminLocationEntity>,
  ) {}

  async getAccountNoDescList(params: GetAccountNoDescListDto, user: UserEntity) {
    const { admin_location_id } = params;
    const exist_admin_location = await this.adminCommonService.getAdminLocationById(
      admin_location_id,
    );
    if (!exist_admin_location) {
      throw new HttpException('Admin location does not exist', HttpStatus.BAD_REQUEST);
    }
    if (
      user.admin_location_level_user == ADMIN_LOCATION_LEVEL_USER.ACCOUNT_NO_DESC_USER ||
      user.admin_location_level_user == ADMIN_LOCATION_LEVEL_USER.PAYPOINT_DESC_USER
    ) {
      const user_detail = await this.adminCommonService.getUserDetailByUserId(user.id);
      const results = await this.employeeRepo
        .createQueryBuilder()
        .select(['account_no_desc'])
        .where('admin_location_id = :id', { id: admin_location_id })
        .groupBy('account_no_desc')
        .getRawMany();
      const rows = [];
      results.map((item) => {
        if (item.account_no_desc == user_detail.account_no_desc) {
          rows.push(item.account_no_desc);
        }
      });
      return {
        status: 'ok',
        message: 'success',
        data: rows,
      };
    } else {
      const results = await this.employeeRepo
        .createQueryBuilder()
        .select(['account_no_desc'])
        .where('admin_location_id = :id', { id: admin_location_id })
        .groupBy('account_no_desc')
        .getRawMany();
      const rows = [];
      results.map((item) => {
        rows.push(item.account_no_desc);
      });
      return {
        status: 'ok',
        message: 'success',
        data: rows,
      };
    }
  }

  async getPaypointDescList(params: GetPaypointDescListDto, user: UserEntity) {
    const { account_no_desc, admin_location_id } = params;
    const exist_admin_location = await this.adminCommonService.getAdminLocationById(
      admin_location_id,
    );
    if (!exist_admin_location) {
      throw new HttpException('Admin location does not exist', HttpStatus.BAD_REQUEST);
    }
    if (user.admin_location_level_user == ADMIN_LOCATION_LEVEL_USER.PAYPOINT_DESC_USER) {
      const user_detail = await this.adminCommonService.getUserDetailByUserId(user.id);
      const results = await this.employeeRepo
        .createQueryBuilder()
        .select(['paypoint_desc'])
        .where('admin_location_id = :id', { id: admin_location_id })
        .andWhere('account_no_desc = :account_no_desc', { account_no_desc })
        .groupBy('paypoint_desc')
        .getRawMany();
      const rows = [];
      results.map((item) => {
        if (item.paypoint_desc == user_detail.paypoint_desc) {
          rows.push(item.paypoint_desc);
        }
      });
      return {
        status: 'ok',
        message: 'success',
        data: rows,
      };
    } else {
      const results = await this.employeeRepo
        .createQueryBuilder()
        .select(['paypoint_desc'])
        .where('admin_location_id = :id', { id: admin_location_id })
        .andWhere('account_no_desc = :account_no_desc', { account_no_desc })
        .groupBy('paypoint_desc')
        .getRawMany();
      const rows = [];
      results.map((item) => {
        rows.push(item.paypoint_desc);
      });
      return {
        status: 'ok',
        message: 'success',
        data: rows,
      };
    }
  }

  async getEmployees(params: GetEmployeesDto, user_id: number) {
    const { admin_location_id, limit, offset, account_no_desc, paypoint_desc } = params;
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
    builder.where('employee.admin_location_id = :id', { id: admin_location_id });
    if (user.admin_location_level_user == ADMIN_LOCATION_LEVEL_USER.ACCOUNT_NO_DESC_USER) {
      builder.andWhere('employee.account_no_desc = :desc', {
        desc: user.userDetail.account_no_desc,
      });
    } else {
      if (account_no_desc && account_no_desc != '') {
        builder.andWhere('employee.account_no_desc = :desc', { desc: account_no_desc });
      }
    }
    if (user.admin_location_level_user == ADMIN_LOCATION_LEVEL_USER.PAYPOINT_DESC_USER) {
      builder.andWhere('employee.paypoint_desc = :paypoint_desc', {
        paypoint_desc: user.userDetail.paypoint_desc,
      });
    } else {
      if (paypoint_desc && paypoint_desc != '') {
        builder.andWhere('employee.paypoint_desc = :paypoint_desc', { paypoint_desc });
      }
    }

    builder
      .andWhere('employee.archived_at IS NULL')
      .leftJoinAndSelect('employee.admin_location', 'ea')
      .leftJoinAndSelect('employee.creator', 'ct')
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
        age: calculateAge(item.date_of_birth),
        occup_pos_cat: item.occup_pos_cat,
        creator: item.creator.email,
        status: item.status,
        created_at: item.createdAt,
        updated_at: item.updatedAt,
      });
    });
    return { status: 'ok', message: 'success', rows: rows, count: count };
  }

  async addEmployee(user: UserEntity, params: AddEmployeeDto) {
    const {
      employee_no,
      admin_location_id,
      name_report,
      position_no,
      occup_pos_title,
      award,
      award_desc,
      classification,
      class_desc,
      step_no,
      occup_type,
      gender,
      first_commence,
      account_no,
      account_no_desc,
      emp_status,
      paypoint,
      paypoint_desc,
      date_of_birth,
      occup_pos_cat,
    } = params;

    const exist_employee = await this.adminCommonService.getEmployeeByNo(employee_no);
    if (exist_employee) {
      throw new HttpException('Employee with that no already exists', HttpStatus.BAD_REQUEST);
    }
    const admin_location = await this.adminCommonService.getAdminLocationById(admin_location_id);
    if (!admin_location) {
      throw new HttpException('Admin location does not exist', HttpStatus.BAD_REQUEST);
    }
    const new_employee = new EmployeeEntity();
    new_employee.employee_no = employee_no;
    new_employee.admin_location = admin_location;
    new_employee.creator = user;
    new_employee.name_report = name_report;
    new_employee.position_no = position_no;
    new_employee.occup_pos_title = occup_pos_title;
    new_employee.award = award;
    new_employee.award_desc = award_desc;
    new_employee.classification = classification;
    new_employee.class_desc = class_desc;
    new_employee.step_no = step_no;
    new_employee.occup_type = occup_type;
    new_employee.gender = gender;
    new_employee.first_commence = first_commence;
    new_employee.account_no = account_no;
    new_employee.account_no_desc = account_no_desc;
    new_employee.emp_status = emp_status;
    new_employee.paypoint = paypoint;
    new_employee.paypoint_desc = paypoint_desc;
    new_employee.date_of_birth = date_of_birth;
    new_employee.occup_pos_cat = occup_pos_cat;

    await this.employeeRepo.save(new_employee);
    return { status: 'ok', message: 'success' };
  }

  async getEmployeeById(params: GetEmployeeByNoDto) {
    const { employee_no } = params;
    const employee = await this.employeeRepo.findOne({
      where: { employee_no },
      relations: ['admin_location', 'creator'],
    });
    if (!employee) {
      throw new HttpException('Employee with that no not exists', HttpStatus.BAD_REQUEST);
    }
    return {
      statue: 'ok',
      message: 'success',
      data: {
        id: employee.id,
        avatar_src: employee.avatar_src,
        employee_no: employee.employee_no,
        name_report: employee.name_report,
        user_type: employee.admin_location.user_type,
        admin_location: employee.admin_location.admin_location,
        admin_desc: employee.admin_location.admin_desc,
        position_no: employee.position_no,
        occup_pos_title: employee.occup_pos_title,
        award: employee.award,
        award_desc: employee.award_desc,
        classification: employee.classification,
        class_desc: employee.class_desc,
        step_no: employee.step_no,
        occup_type: employee.occup_type,
        gender: employee.gender,
        first_commence: employee.first_commence,
        account_no: employee.account_no,
        account_no_desc: employee.account_no_desc,
        emp_status: employee.emp_status,
        paypoint: employee.paypoint,
        paypoint_desc: employee.paypoint_desc,
        date_of_birth: employee.date_of_birth,
        age: calculateAge(employee.date_of_birth),
        occup_pos_cat: employee.occup_pos_cat,
        status: employee.status,
        creator: employee.creator.email,
        created_at: employee.createdAt,
        updated_at: employee.updatedAt,
      },
    };
  }

  async updateEmployee(params: UpdateEmployeeDto) {
    const {
      employee_no,
      position_no,
      occup_pos_title,
      award,
      award_desc,
      classification,
      class_desc,
      step_no,
      occup_type,
      gender,
      first_commence,
      account_no,
      account_no_desc,
      emp_status,
      paypoint,
      paypoint_desc,
      date_of_birth,
      occup_pos_cat,
    } = params;

    const employee = await this.adminCommonService.getEmployeeByNo(employee_no);
    if (!employee) {
      throw new HttpException('Employee with that no not exists', HttpStatus.BAD_REQUEST);
    }

    employee.position_no = position_no;
    employee.occup_pos_title = occup_pos_title;
    employee.award = award;
    employee.award_desc = award_desc;
    employee.classification = classification;
    employee.class_desc = class_desc;
    employee.step_no = step_no;
    employee.occup_type = occup_type;
    employee.gender = gender;
    employee.first_commence = first_commence;
    employee.account_no = account_no;
    employee.account_no_desc = account_no_desc;
    employee.emp_status = emp_status;
    employee.paypoint = paypoint;
    employee.paypoint_desc = paypoint_desc;
    employee.date_of_birth = date_of_birth;
    employee.occup_pos_cat = occup_pos_cat;

    await this.employeeRepo.save(employee);

    return { status: 'ok', message: 'success' };
  }

  async deleteEmployee(params: DeleteEmployeeDto) {
    const { employee_no } = params;
    const employee = await this.adminCommonService.getEmployeeByNo(employee_no);
    if (!employee) {
      throw new HttpException('Employee with that no not exists', HttpStatus.BAD_REQUEST);
    }
    await this.employeeRepo.softDelete(employee.id);
    return { status: 'ok', message: 'success' };
  }

  async changeEmployeeStatus(params: ChangeEmployeeStatusDto) {
    const { employee_no, status } = params;
    const employee = await this.adminCommonService.getEmployeeByNo(employee_no);
    if (!employee) {
      throw new HttpException('Employee with that no not exists', HttpStatus.BAD_REQUEST);
    }
    employee.status = status;
    await this.employeeRepo.save(employee);
    return { status: 'ok', message: 'success' };
  }

  async saveEmployeeAvatar(params: EmployeeAvatarDto, file) {
    const { employee_no } = params;
    const employee = await this.adminCommonService.getEmployeeByNo(employee_no);
    if (!employee) {
      throw new HttpException('Employee with that no not exists', HttpStatus.BAD_REQUEST);
    }
    employee.avatar_src = file.filename;
    await this.employeeRepo.save(employee);
    return { status: 'ok', message: 'success' };
  }

  async saveEmployeeArchiveFile(params: EmployeeArchiveFileDto, file) {
    const { employee_no } = params;
    const employee = await this.adminCommonService.getEmployeeByNo(employee_no);
    if (!employee) {
      throw new HttpException('Employee with that no not exists', HttpStatus.BAD_REQUEST);
    }
    employee.archived_file = file.filename;
    await this.employeeRepo.save(employee);
    return { status: 'ok', message: 'success' };
  }

  async archiveOn(user: UserEntity, params: EmployeeArchiveDto) {
    const { employee_no, archived_reason, archived_comment } = params;
    const employee = await this.employeeRepo.findOne({
      where: {
        employee_no: employee_no,
        archived_at: null,
      },
    });
    if (!employee) {
      throw new HttpException('Employee with that no not exists', HttpStatus.BAD_REQUEST);
    }
    employee.archived_at = new Date();
    employee.archived_reason = archived_reason;
    employee.archived_comment = archived_comment;
    employee.archive_user = user;
    await this.employeeRepo.save(employee);

    return { status: 'ok', message: 'success' };
  }

  async archiveOff(params: EmployeeArchiveDto) {
    const { employee_no, archived_reason, archived_comment } = params;
    const employee = await this.employeeRepo.findOne({
      where: {
        employee_no: employee_no,
        archived_at: Not(IsNull()),
      },
    });
    if (!employee) {
      throw new HttpException('Employee with that no not exists', HttpStatus.BAD_REQUEST);
    }
    employee.archived_at = null;
    employee.archived_by = null;
    employee.archived_reason = archived_reason;
    employee.archived_comment = archived_comment;
    await this.employeeRepo.save(employee);

    return { status: 'ok', message: 'success' };
  }

  async getArchiveEmployees(params: GetArchivedEmployeesDto) {
    const { search, limit, offset } = params;
    const sort: Sort = {
      field: 'employee.id',
      order: SortType.ASC,
    };
    const builder = this.employeeRepo.createQueryBuilder('employee');
    if (search) {
      builder.where(
        new Brackets((subQuery) => {
          subQuery.orWhere(`employee.employee_no LIKE '%${search}%'`);
          subQuery.orWhere(`employee.name_report LIKE '%${search}%'`);
          subQuery.orWhere(`ead.admin_location LIKE '%${search}%'`);
        }),
      );
    }
    builder
      .andWhere('employee.archived_at IS NOT NULL')
      .leftJoinAndSelect('employee.admin_location', 'ead')
      .leftJoinAndSelect('employee.archive_user', 'ear')
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
        archived_at: item.archived_at,
        archived_by: item.archive_user.email,
        updated_at: item.updatedAt,
        admin_desc: item.admin_location.admin_desc,
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
        age: calculateAge(item.date_of_birth),
        occup_pos_cat: item.occup_pos_cat,
      });
    });
    return { status: 'ok', message: 'success', rows: rows, count: count };
  }

  async getArchivedEmployeeByNo(params: GetEmployeeByNoDto) {
    const { employee_no } = params;
    const employee = await this.employeeRepo.findOne({
      where: { employee_no, archived_at: Not(IsNull()) },
      relations: ['admin_location', 'creator', 'archive_user'],
    });
    if (!employee) {
      throw new HttpException('Employee with that no not exists', HttpStatus.BAD_REQUEST);
    }
    return {
      statue: 'ok',
      message: 'success',
      data: {
        id: employee.id,
        employee_no: employee.employee_no,
        name_report: employee.name_report,
        user_type: employee.admin_location.user_type,
        admin_location: employee.admin_location.admin_location,
        admin_desc: employee.admin_location.admin_desc,
        position_no: employee.position_no,
        occup_pos_title: employee.occup_pos_title,
        award: employee.award,
        award_desc: employee.award_desc,
        classification: employee.classification,
        class_desc: employee.class_desc,
        step_no: employee.step_no,
        occup_type: employee.occup_type,
        gender: employee.gender,
        first_commence: employee.first_commence,
        account_no: employee.account_no,
        account_no_desc: employee.account_no_desc,
        emp_status: employee.emp_status,
        paypoint: employee.paypoint,
        paypoint_desc: employee.paypoint_desc,
        date_of_birth: employee.date_of_birth,
        age: calculateAge(employee.date_of_birth),
        occup_pos_cat: employee.occup_pos_cat,
        status: employee.status,
        creator: employee.creator.email,
        created_at: employee.createdAt,
        updated_at: employee.updatedAt,
        archived_at: employee.archived_at,
        archived_reason: employee.archived_reason,
        archived_comment: employee.archived_comment,
        archived_file: employee.archived_file,
        archived_by: employee.archive_user.email,
      },
    };
  }
}
