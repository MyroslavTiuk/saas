import { IsNotEmpty, IsString } from 'class-validator';

export class GetEmployeeByNoDto {
  @IsNotEmpty()
  @IsString()
  employee_no: string;
}
