import { IsNotEmpty, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class ChartWeeklyDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  year: number;
}
