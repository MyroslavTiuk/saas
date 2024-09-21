import { IsNotEmpty, IsString } from 'class-validator';

export class DeviceClockOutDto {
  @IsNotEmpty()
  @IsString()
  employee_no: string;

  @IsNotEmpty()
  @IsString()
  date: string;

  @IsNotEmpty()
  @IsString()
  clocked_out: string;
}
