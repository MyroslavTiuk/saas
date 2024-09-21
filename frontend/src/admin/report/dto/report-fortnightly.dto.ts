import { IsNotEmpty, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class ReportFortnightlyDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  admin_location_id: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  pay_no: number;
}
