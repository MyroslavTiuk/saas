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
import { hash as CryptoHash } from 'bcrypt';
import { ACCESS_PRIVILEGE } from '../../utils/const';
import { AdminCommonService } from '../admin-common/admin-common.service';

import * as userJSON from '../../../data/users.json';
import * as deviceJSON from '../../../data/devices.json';
import * as payloadJSON from '../../../data/payloads.json';
import * as adminLocationJSON from '../../../data/admin_locations.json';
import * as employeeJSON from '../../../data/employees/113.json';
import * as attendancesJSON from '../../../data/attendances.json';
import moment from 'moment';

@Injectable()
export class SeedService {
  constructor(
    private adminCommonService: AdminCommonService,
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
  ) {}

  async step1() {
    // add main admin
    let new_user = new UserEntity();
    new_user.email = 'admin@pngtimeaccess.com';
    new_user.password = await CryptoHash('PT@dev2-23', 10);
    new_user.access_privilege = ACCESS_PRIVILEGE.SUPER_USER;
    new_user = await this.userRepo.save(new_user);

    const user_detail = new UserDetailEntity();
    user_detail.user = new_user;
    user_detail.surname = 'Yalon';
    user_detail.given_name = 'Max';
    user_detail.job_title = 'Owner';
    user_detail.office_phone = '3019195';
    user_detail.mobile_number = '72098407';

    await this.userDetailRepo.save(user_detail);
    return { status: 'ok', message: 'success' };
  }

  /**
   * Admin Location
   */
  async step2() {
    // add admin location
    const creator = await this.adminCommonService.getUserById(1);
    const jsonString = JSON.stringify(adminLocationJSON);
    const json = JSON.parse(jsonString);

    const adminLocations: AdminLocationEntity[] = [];
    json.admin_locations.map((item) => {
      const new_location = new AdminLocationEntity();
      new_location.admin_location = item.admin_location;
      new_location.admin_desc = item.admin_desc;
      new_location.user_type = item.user_type;
      new_location.creator = creator;
      new_location.createdAt = item.created_at;
      new_location.updatedAt = item.updated_at;
      adminLocations.push(new_location);
    });

    await this.adminLocationRepo.manager.save(adminLocations);

    return { status: 'ok', message: 'success' };
  }

  /**
   * @deprecated
   * Admin Users - currently no need to run
   */
  async step3() {
    // add User from Json
    const creator = await this.adminCommonService.getUserById(1);
    const jsonString = JSON.stringify(userJSON);
    const json = JSON.parse(jsonString);

    json.users.map(async (item) => {
      if (item.access_privilege != 'Bureaucrat User') {
        let new_user = new UserEntity();
        new_user.email = item.email;
        new_user.password = await CryptoHash('PT@dev2-23', 10);
        new_user.access_privilege = item.access_privilege != '' ? item.access_privilege : null;
        new_user.admin_location_level_user = item.admin_location_level_user;
        new_user.status = item.status == 'Active';
        new_user.creator = creator.email;
        new_user.createdAt = item.created_at;
        new_user.updatedAt = item.updated_at;
        if (item.admin_location_level_user != null) {
          const admin_location = await this.adminLocationRepo.findOne({
            where: { admin_desc: item.admin_desc },
          });
          if (admin_location) {
            new_user.admin_location = admin_location;
          }
        }

        new_user = await this.userRepo.save(new_user);
        const user_detail = new UserDetailEntity();
        user_detail.user = new_user;
        user_detail.surname = item.surname;
        user_detail.given_name = item.given_name;
        user_detail.job_title = item.job_title;
        user_detail.office_phone = item.office_phone;
        user_detail.mobile_number = item.mobile_number;
        user_detail.admin_desc = item.admin_desc;
        user_detail.account_no_desc = item.account_no_desc != '' ? item.account_no_desc : null;
        user_detail.paypoint_desc = item.paypoint_desc != '' ? item.paypoint_desc : null;

        await this.userDetailRepo.save(user_detail);
      }
    });
    return { status: 'ok', message: 'success' };
  }

  /**
   * @deprecated
   * Devices - currently not need to run
   */
  async step4() {
    // add devices
    const creator = await this.adminCommonService.getUserById(1);
    const jsonString = JSON.stringify(deviceJSON);
    const json = JSON.parse(jsonString);

    const devices: DeviceEntity[] = [];
    json.devices.map((item) => {
      const new_device = new DeviceEntity();
      new_device.admin_location_id = item.admin_location_id;
      new_device.device_id = item.device_id;
      new_device.device_product_key = item.device_product_key;
      new_device.device_name = item.device_name;
      new_device.make_or_model = item.make_or_model;
      new_device.gps_location = item.gps_location;
      new_device.account_no_desc = item.account_no_desc;
      new_device.paypoint_desc = item.paypoint_desc;
      new_device.ip_address = item.ip_address;
      new_device.status = item.status == 'Enabled';
      new_device.creator = creator;
      devices.push(new_device);
    });
    await this.deviceRepo.save(devices);
    return { status: 'ok', message: 'success' };
  }

  /**
   * @deprecated
   * Payload
   */
  async step5() {
    const jsonString = JSON.stringify(payloadJSON);
    const json = JSON.parse(jsonString);
    const payloads: PayloadEntity[] = [];
    json.payloads.map((item) => {
      const start = new Date(item.start_at);
      const end = new Date(item.end_at);
      const new_payload = new PayloadEntity();
      new_payload.pay_no = item.pay_no;
      new_payload.start_at = moment(start, 'YYYY-MM-DD 00:00:00').toDate();
      new_payload.end_at = moment(end, 'YYYY-MM-DD 23:59:59').toDate();
      payloads.push(new_payload);
    });
    await this.payloadRepo.save(payloads);
    return { status: 'ok', message: 'success' };
  }

  /**
   * @deprecated
   * Employees
   */
  async step6() {
    // add employees
    const creator = await this.adminCommonService.getUserById(1);
    const jsonString = JSON.stringify(employeeJSON);
    const json = JSON.parse(jsonString);

    const employees: EmployeeEntity[] = [];
    json.employees.map((item) => {
      const new_employee = new EmployeeEntity();
      new_employee.employee_no = item.employee_no;
      new_employee.admin_location_id = item.admin_location_id;
      new_employee.name_report = item.name_report;
      new_employee.position_no = item.position_no;
      new_employee.occup_pos_title = item.occup_pos_title;
      new_employee.award = item.award;
      new_employee.award_desc = item.award_desc;
      new_employee.classification = item.classification;
      new_employee.class_desc = item.class_desc;
      new_employee.step_no = item.step_no;
      new_employee.occup_type = item.occup_type;
      new_employee.gender = item.gender;
      new_employee.first_commence = item.first_commence;
      new_employee.account_no = item.account_no;
      new_employee.account_no_desc = item.account_no_desc;
      new_employee.emp_status = item.emp_status;
      new_employee.paypoint = item.paypoint;
      new_employee.paypoint_desc = item.paypoint_desc;
      new_employee.date_of_birth = item.date_of_birth;
      new_employee.occup_pos_cat = item.occup_pos_cat;
      new_employee.avatar_src = item.avatar_src;
      new_employee.status = item.status == 'Active';
      new_employee.createdAt = item.created_at;
      new_employee.updatedAt = item.updated_at;
      new_employee.creator = creator;
      employees.push(new_employee);
    });
    await this.employeeRepo.save(employees);
    return { status: 'ok', message: 'success' };
  }

  /**
   * @deprecated
   */
  async step7() {
    const jsonString = JSON.stringify(attendancesJSON);
    const json = JSON.parse(jsonString);
    const did = 2;

    const attendances: AttendanceEntity[] = [];
    for (let i = 0; i < json.attendances.length; i++) {
      const item = json.attendances[i];
      if (item.admin_location_id == 113) {
        const employee = await this.adminCommonService.getEmployeeByNo(item.employee_no);
        const new_attendance = new AttendanceEntity();
        new_attendance.clock_in_device_id = did;
        new_attendance.clock_out_device_id = did;
        new_attendance.employee = employee;
        new_attendance.clocked_in = item.clocked_in;
        new_attendance.clocked_out = item.clocked_out;
        new_attendance.worked_hours = item.worked_hours;
        new_attendance.date = item.date;
        attendances.push(new_attendance);
      }
    }
    await this.attendanceRepo.save(attendances);
    return { status: 'ok', message: 'success' };
  }
}
