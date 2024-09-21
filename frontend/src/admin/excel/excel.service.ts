import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AdminCommonService } from '../admin-common/admin-common.service';
import { InjectRepository } from '@nestjs/typeorm';
import { EmployeeEntity } from '../../database/entities/employee.entity';
import { Repository } from 'typeorm';
import { AdminLocationEntity } from '../../database/entities/admin_location.entity';
import excelToJson from 'convert-excel-to-json';
import { ImportExcelDto } from './dto/import-excel.dto';
import * as fs from 'fs';
import { UserEntity } from '../../database/entities/user.entity';

@Injectable()
export class ExcelService {
  constructor(
    private readonly adminCommonService: AdminCommonService,
    @InjectRepository(EmployeeEntity)
    private readonly employeeRepo: Repository<EmployeeEntity>,
    @InjectRepository(AdminLocationEntity)
    private readonly adminLocationRepo: Repository<AdminLocationEntity>,
  ) {}

  async importExcel(user: UserEntity, query: ImportExcelDto, file) {
    const { admin_location_id } = query;
    const filePath = 'uploads/excel/' + file.filename;
    const excelData = excelToJson({
      sourceFile: filePath,
      header: {
        rows: 1,
      },
      columnToKey: {
        '*': '{{columnHeader}}',
      },
    });

    await fs.unlink(filePath, (_) => {
      console.log(_);
    });

    const sheet = this.getSheet(excelData);
    if (!sheet) {
      throw new HttpException('Invalid Request', HttpStatus.BAD_REQUEST);
    }

    const admin_location = await this.adminCommonService.getAdminLocationById(admin_location_id);
    if (!admin_location) {
      throw new HttpException('Admin location does not exist', HttpStatus.BAD_REQUEST);
    }
    const employees: EmployeeEntity[] = [];
    sheet.reduce((acc, row) => {
      if (
        row['Admin Location'] == admin_location.admin_location &&
        row['Admin Desc'] == admin_location.admin_desc
      ) {
        const new_employee = new EmployeeEntity();
        new_employee.admin_location = admin_location;
        new_employee.employee_no = row['Employee No'];
        new_employee.creator = user;
        new_employee.name_report = row['Name Report'];
        new_employee.position_no = row['Position No'];
        new_employee.occup_pos_title = row['Occup Pos Title'];
        new_employee.award = row['Award'];
        new_employee.award_desc = row['Award Desc'];
        new_employee.classification = row['Classification'];
        new_employee.class_desc = row['Class Desc'];
        new_employee.step_no = row['Step No'];
        new_employee.occup_type = row['Occup Type'];
        new_employee.gender = row['Gender'];
        new_employee.first_commence = row['First Commence'];
        new_employee.account_no = row['Account No'];
        new_employee.account_no_desc = row['Account No Desc'];
        new_employee.emp_status = row['Emp Status'];
        new_employee.paypoint = row['Paypoint'];
        new_employee.paypoint_desc = row['Paypoint Desc'];
        new_employee.date_of_birth = row['Date Of Birth'];
        new_employee.occup_pos_cat = row['Occup Pos Cat'];
        employees.push(new_employee);
      }
    });
    await this.employeeRepo.save(employees);
    if (employees.length == 0) {
      throw new HttpException('There is no data to import', HttpStatus.BAD_REQUEST);
    }
    return { status: 'ok', message: 'success' };
  }

  getSheet(excelData) {
    for (const name of ['Sheet1', 'Sheet 1']) {
      if (excelData[name]) {
        return excelData[name];
      }
    }
    return null;
  }
}
