import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class ReportEmployeeFortnightlyDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  admin_location_id: number;

  @IsNotEmpty()
  @IsString()
  employee_no: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  pay_no: number;
}
