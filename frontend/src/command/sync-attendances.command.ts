import { Injectable } from '@nestjs/common';
import { Command, Positional } from 'nestjs-command';
import fs from 'fs';
import { join } from 'path';
import process from 'process';
import { AttendanceEntity } from '../database/entities/attendance.entity';
import { AdminCommonService } from '../admin/admin-common/admin-common.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import moment from 'moment';

@Injectable()
export class SyncAttendancesCommand {
  constructor(
    private adminCommonService: AdminCommonService,
    @InjectRepository(AttendanceEntity)
    private readonly attendanceRepo: Repository<AttendanceEntity>,
  ) {}
  @Command({
    command: 'sync:attendances <file>',
    describe: 'Sync Attendances with json file',
  })
  async syncAttendances(
    @Positional({
      name: 'file',
      describe: 'file name',
      type: 'string',
    })
    file: string,
  ) {
    try {
      const response = fs
        .readFileSync(join(process.cwd(), './uploads/sync/' + file), 'utf-8')
        .toString();
      const json = JSON.parse(response);
      const device_id = 4; // Need to replace
      let attendances: AttendanceEntity[] = [];
      console.log(json.RECORDS.length);
      for (let index = 0; index < json.RECORDS.length; index++) {
        const item = json.RECORDS[index];
        if (item.admin_location_id == 113) {
          const employee = await this.adminCommonService.getEmployeeByNo(item.employee_no);
          const new_attendance = new AttendanceEntity();
          new_attendance.employee = employee;
          new_attendance.clock_in_device_id = device_id;
          new_attendance.clock_out_device_id = item.clocked_out != '' ? device_id : null;
          new_attendance.clocked_in = item.clocked_in;
          new_attendance.clocked_out = item.clocked_out != '' ? item.clocked_out : null;
          new_attendance.worked_hours = item.worked_hours != '' ? item.worked_hours : null;
          new_attendance.date = moment.utc(Date.parse(item.date)).format('YYYY-MM-DD');
          attendances.push(new_attendance);
        }
        if (attendances.length > 10) {
          console.log('Index: ' + index);
          await this.attendanceRepo.save(attendances);
          attendances = [];
        }
      }
      if (attendances.length > 0) {
        await this.attendanceRepo.save(attendances);
      }
    } catch (error) {
      console.log(error);
    }
    console.log('Command End Point');
  }
}
