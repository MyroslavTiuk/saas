import { IsNotEmpty, IsString } from 'class-validator';

export class EmployeeAvatarDto {
  @IsNotEmpty()
  @IsString()
  employee_no: string;
}
