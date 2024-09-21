import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class AddDeviceDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  admin_location_id: number;

  @IsNotEmpty()
  @IsString()
  device_id: string;

  @IsNotEmpty()
  @IsString()
  device_name: string;

  @IsNotEmpty()
  @IsString()
  make_or_model: string;

  @IsNotEmpty()
  @IsString()
  account_no_desc: string;

  @IsNotEmpty()
  @IsString()
  paypoint_desc: string;
}
