import { IsNotEmpty, IsString } from 'class-validator';

export class DeviceGetEmployeesDto {
  @IsNotEmpty()
  @IsString()
  page: string;
}
