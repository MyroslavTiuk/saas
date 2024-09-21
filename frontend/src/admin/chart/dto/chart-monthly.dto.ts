import { IsNotEmpty, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class ChartMonthlyDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  year: number;
}
