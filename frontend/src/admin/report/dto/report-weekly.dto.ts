import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class ReportWeeklyDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  admin_location_id: number;

  @IsNotEmpty()
  @IsString()
  date: string;
}
