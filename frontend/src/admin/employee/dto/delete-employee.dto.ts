import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteEmployeeDto {
  @IsNotEmpty()
  @IsString()
  employee_no: string;
}
