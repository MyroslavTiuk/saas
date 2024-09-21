import { IsNotEmpty, IsString } from 'class-validator';

export class DeviceClockInDto {
  @IsNotEmpty()
  @IsString()
  employee_no: string;

  @IsNotEmpty()
  @IsString()
  date: string;

  @IsNotEmpty()
  @IsString()
  clocked_in: string;
}
