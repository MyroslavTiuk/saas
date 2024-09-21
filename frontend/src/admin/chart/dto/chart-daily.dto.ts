import { IsNotEmpty, IsString } from 'class-validator';

export class ChartDailyDto {
  @IsNotEmpty()
  @IsString()
  date: Date;
}
