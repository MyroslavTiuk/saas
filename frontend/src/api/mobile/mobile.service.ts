import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DeviceLoginDto } from './dto/device-login.dto';
import { CommonService } from '../common/common.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeviceEntity } from '../../database/entities/device.entity';
import { EmployeeEntity } from '../../database/entities/employee.entity';
import { PayloadEntity } from '../../database/entities/payload.entity';
import { AttendanceEntity } from '../../database/entities/attendance.entity';
import { AdminLocationEntity } from '../../database/entities/admin_location.entity';
import { DeviceGetEmployeesDto } from './dto/device-get-employees.dto';
import { Sort, SortType } from '../../type/pageable';
import { DeviceClockInDto } from './dto/device-clock-in.dto';
import { DeviceClockOutDto } from './dto/device-clock-out.dto';
import { getWorkedHours, normalizeReportName } from '../../utils/helper';

@Injectable()
export class MobileService {
  constructor(
    private commonService: CommonService,
    @InjectRepository(DeviceEntity)
    private readonly deviceRepo: Repository<DeviceEntity>,
    @InjectRepository(EmployeeEntity)
    private readonly employeeRepo: Repository<EmployeeEntity>,
    @InjectRepository(PayloadEntity)
    private readonly payloadRepo: Repository<PayloadEntity>,
    @InjectRepository(AttendanceEntity)
    private readonly attendanceRepo: Repository<AttendanceEntity>,
    @InjectRepository(AdminLocationEntity)
    private readonly adminLocationRepo: Repository<AdminLocationEntity>,
  ) {}

  async deviceLogin(params: DeviceLoginDto) {
    const { device_id, device_product_key, ip_address } = params;
    const device = await this.commonService.getDeviceByHeader(device_id, device_product_key);
    if (!device) {
      throw new HttpException('Activate Failed, device not found!', HttpStatus.BAD_REQUEST);
    }
    if (!ip_address) {
      device.ip_address = ip_address;
      await this.deviceRepo.save(device);
    }
    return { status: 'ok', message: 'success', device: { id: device.id } };
  }

  async getEmployees(device: DeviceEntity, params: DeviceGetEmployeesDto) {
    const { page } = params;
    const size = 100;
    const { limit, offset } = this.getPagination(page, size);
    const sort: Sort = {
      field: 'employee.id',
      order: SortType.ASC,
    };
    const builder = this.employeeRepo.createQueryBuilder('employee');
    builder.where('employee.admin_location_id = :id', { id: device.admin_location_id });
    builder
      .andWhere('employee.archived_at IS NULL')
      .orderBy(sort.field, sort.order)
      .offset(offset)
      .limit(limit);
    const [data, count] = await builder.getManyAndCount();
    const rows = [];

    data.map((item) => {
      rows.push({
        employee_no: item.employee_no,
        name_report: item.name_report,
      });
    });
    return {
      status: 'ok',
      message: 'success',
      data: {
        totalItems: count,
        employees: rows,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
      },
    };
  }

  getPagination(page, size) {
    const limit = size ? +size : 100;
    const offset = page ? (page - 1) * limit : 1;
    return { limit, offset };
  }

  async clockIn(device: DeviceEntity, params: DeviceClockInDto) {
    const { employee_no, date, clocked_in } = params;
    const employee = await this.commonService.getEmployeeByNo(employee_no);
    if (!employee) {
      throw new HttpException('Employee with that no not exists', HttpStatus.BAD_REQUEST);
    }
    if (employee.admin_location_id != device.admin_location_id) {
      throw new HttpException('Invalid Request!', HttpStatus.BAD_REQUEST);
    }
    const nameReport = normalizeReportName(employee.name_report);
    const existAttendance = await this.attendanceRepo.findOne({
      where: {
        employee_id: employee.id,
        date: date,
      },
    });
    if (existAttendance) {
      if (existAttendance.clocked_in) {
        if (existAttendance.clock_in_device_id == device.id) {
          throw new HttpException(
            `Hi ${nameReport}, your clock-in is already registered. Thank you`,
            HttpStatus.BAD_REQUEST,
          );
        }
        const oldTime = Date.parse(`${existAttendance.date} ${existAttendance.clocked_in}`);
        const newTime = Date.parse(`${date} ${clocked_in}`);
        if (oldTime > newTime) {
          existAttendance.clocked_in = clocked_in;
          existAttendance.clockInDevice = device;
          if (existAttendance.clocked_out) {
            existAttendance.worked_hours = getWorkedHours(clocked_in, existAttendance.clocked_out);
          }
          await this.attendanceRepo.save(existAttendance);
          return {
            status: 'ok',
            message: `Welcome ${nameReport}`,
          };
        } else {
          throw new HttpException(
            `Hi ${nameReport}, your clock-in is already registered. Thank you`,
            HttpStatus.BAD_REQUEST,
          );
        }
      } else {
        existAttendance.clocked_in = clocked_in;
        existAttendance.clockInDevice = device;
        if (existAttendance.clocked_out) {
          existAttendance.worked_hours = getWorkedHours(clocked_in, existAttendance.clocked_out);
        }
        await this.attendanceRepo.save(existAttendance);
        return {
          status: 'ok',
          message: `Welcome ${nameReport}`,
        };
      }
    } else {
      // add new attendance
      const new_attendance = new AttendanceEntity();
      new_attendance.employee = employee;
      new_attendance.clockInDevice = device;
      new_attendance.date = date;
      new_attendance.clocked_in = clocked_in;
      new_attendance.worked_hours = '00:00:00';

      await this.attendanceRepo.save(new_attendance);
      return {
        status: 'ok',
        message: `Welcome ${nameReport}`,
      };
    }
  }

  async clockOut(device: DeviceEntity, params: DeviceClockOutDto) {
    const { employee_no, date, clocked_out } = params;
    const employee = await this.commonService.getEmployeeByNo(employee_no);
    if (!employee) {
      throw new HttpException('Employee with that no not exists', HttpStatus.BAD_REQUEST);
    }
    if (employee.admin_location_id != device.admin_location_id) {
      throw new HttpException('Invalid Request!', HttpStatus.BAD_REQUEST);
    }
    const nameReport = normalizeReportName(employee.name_report);
    const existAttendance = await this.attendanceRepo.findOne({
      where: {
        employee_id: employee.id,
        date: date,
      },
    });
    if (existAttendance) {
      if (existAttendance.clocked_out) {
        if (existAttendance.clock_out_device_id == device.id) {
          throw new HttpException(
            `Hi ${nameReport}, your clock-out is already registered. Thank you`,
            HttpStatus.BAD_REQUEST,
          );
        }
        const oldTime = Date.parse(`${existAttendance.date} ${existAttendance.clocked_out}`);
        const newTime = Date.parse(`${date} ${clocked_out}`);
        if (oldTime > newTime) {
          existAttendance.clocked_out = clocked_out;
          existAttendance.clockOutDevice = device;
          if (existAttendance.clocked_in) {
            existAttendance.worked_hours = getWorkedHours(existAttendance.clocked_in, clocked_out);
          }
          await this.attendanceRepo.save(existAttendance);
          return {
            status: 'ok',
            message: `Good bye ${nameReport}`,
          };
        } else {
          throw new HttpException(
            `Hi ${nameReport}, your clock-out is already registered. Thank you`,
            HttpStatus.BAD_REQUEST,
          );
        }
      } else {
        existAttendance.clocked_out = clocked_out;
        existAttendance.clockOutDevice = device;
        existAttendance.worked_hours = getWorkedHours(existAttendance.clocked_in, clocked_out);
        await this.attendanceRepo.save(existAttendance);
        return {
          status: 'ok',
          message: `Good bye ${nameReport}`,
        };
      }
    } else {
      // add new attendance
      const new_attendance = new AttendanceEntity();
      new_attendance.employee = employee;
      new_attendance.clockOutDevice = device;
      new_attendance.date = date;
      new_attendance.clocked_out = clocked_out;
      new_attendance.worked_hours = '00:00:00';

      await this.attendanceRepo.save(new_attendance);
      return {
        status: 'ok',
        message: `Good bye ${nameReport}`,
      };
    }
  }
}
