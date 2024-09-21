import { Injectable } from '@nestjs/common';
import { Command, Positional } from 'nestjs-command';
import fs from 'fs';
import { join } from 'path';
import process from 'process';
import { AdminCommonService } from '../admin/admin-common/admin-common.service';
import { InjectRepository } from '@nestjs/typeorm';
import { EmployeeEntity } from '../database/entities/employee.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SyncEmployeesCommand {
  constructor(
    private adminCommonService: AdminCommonService,
    @InjectRepository(EmployeeEntity)
    private readonly employeeRepo: Repository<EmployeeEntity>,
  ) {}
  @Command({
    command: 'sync:employees <file>',
    describe: 'Sync Employees with json file',
  })
  async syncEmployees(
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
      const creator = await this.adminCommonService.getUserById(1);
      let employees: EmployeeEntity[] = [];
      console.log(json.RECORDS.length);
      for (let index = 0; index < json.RECORDS.length; index++) {
        const item = json.RECORDS[index];
        const new_employee = new EmployeeEntity();
        new_employee.employee_no = item.employee_no;
        new_employee.admin_location_id = item.admin_location_id;
        new_employee.name_report = item.name_report != '' ? item.name_report : null;
        new_employee.position_no = item.position_no != '' ? item.position_no : null;
        new_employee.occup_pos_title = item.occup_pos_title != '' ? item.occup_pos_title : null;
        new_employee.award = item.award != '' ? item.award : null;
        new_employee.award_desc = item.award_desc != '' ? item.award_desc : null;
        new_employee.classification = item.classification != '' ? item.classification : null;
        new_employee.class_desc = item.class_desc != '' ? item.class_desc : null;
        new_employee.step_no = item.step_no != '' ? item.step_no : null;
        new_employee.occup_type = item.occup_type != '' ? item.occup_type : null;
        new_employee.gender = item.gender != '' ? item.gender : null;
        new_employee.first_commence = item.first_commence != '' ? item.first_commence : null;
        new_employee.account_no = item.account_no != '' ? item.account_no : null;
        new_employee.account_no_desc = item.account_no_desc != '' ? item.account_no_desc : null;
        new_employee.emp_status = item.emp_status != '' ? item.emp_status : null;
        new_employee.paypoint = item.paypoint != '' ? item.paypoint : null;
        new_employee.paypoint_desc = item.paypoint_desc != '' ? item.paypoint_desc : null;
        new_employee.date_of_birth = item.date_of_birth != '' ? item.date_of_birth : null;
        new_employee.occup_pos_cat = item.occup_pos_cat != '' ? item.occup_pos_cat : null;
        new_employee.avatar_src = item.avatar_src != '' ? item.avatar_src : null;
        new_employee.status = item.status == 'Active';
        new_employee.creator = creator;
        new_employee.archived_at = item.archived_at != '' ? item.archived_at : null;
        new_employee.archived_reason = item.archived_reason != '' ? item.archived_reason : null;
        new_employee.archived_comment = item.archived_comment != '' ? item.archived_comment : null;
        new_employee.archive_user = item.archived_at != '' ? creator : null;
        new_employee.archived_file = item.archived_file != '' ? item.archived_file : null;
        employees.push(new_employee);
        if (employees.length > 10) {
          console.log('Index: ' + index);
          await this.employeeRepo.save(employees);
          employees = [];
        }
      }
      if (employees.length > 0) {
        await this.employeeRepo.save(employees);
      }
    } catch (error) {
      console.log(error);
    }
    console.log('Command End Point');
  }
}
