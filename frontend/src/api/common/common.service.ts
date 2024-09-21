import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeviceEntity } from '../../database/entities/device.entity';
import { Repository } from 'typeorm';
import { PayloadEntity } from '../../database/entities/payload.entity';
import { EmployeeEntity } from '../../database/entities/employee.entity';
import { AttendanceEntity } from '../../database/entities/attendance.entity';
import { AdminLocationEntity } from '../../database/entities/admin_location.entity';
import { DeviceMiddleware } from '../middleware/device.middleware';

@Injectable()
export class CommonService {
  constructor(
    @InjectRepository(DeviceEntity)
    private readonly deviceRepo: Repository<DeviceEntity>,
    @InjectRepository(PayloadEntity)
    private readonly payloadRepo: Repository<PayloadEntity>,
    @InjectRepository(EmployeeEntity)
    private readonly employeeRepo: Repository<EmployeeEntity>,
    @InjectRepository(AttendanceEntity)
    private readonly attendanceRepo: Repository<AttendanceEntity>,
    @InjectRepository(AdminLocationEntity)
    private readonly adminLocationRepo: Repository<AdminLocationEntity>,
  ) {}

  async getDeviceByHeader(
    device_code: string,
    device_product_key: string,
  ): Promise<DeviceEntity | null> {
    const device = await this.deviceRepo.findOne({
      where: {
        device_id: device_code,
        device_product_key: device_product_key,
        status: true,
      },
    });
    if (device) {
      return device;
    }
    return null;
  }

  async getEmployeeByNo(employee_no: string): Promise<EmployeeEntity | null> {
    const employee = await this.employeeRepo.findOne({
      where: {
        employee_no: employee_no,
        status: true,
      },
    });
    if (employee) {
      return employee;
    }
    return null;
  }
}
