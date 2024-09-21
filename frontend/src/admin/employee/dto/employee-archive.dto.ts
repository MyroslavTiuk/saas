import { IsNotEmpty, IsString } from 'class-validator';

export class EmployeeArchiveDto {
  @IsNotEmpty()
  @IsString()
  employee_no: string;

  @IsNotEmpty()
  @IsString()
  archived_reason: string;

  @IsNotEmpty()
  @IsString()
  archived_comment: string;
}
