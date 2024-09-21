import { IsNotEmpty, IsString } from 'class-validator';

export class EmployeeArchiveFileDto {
  @IsNotEmpty()
  @IsString()
  employee_no: string;
}
