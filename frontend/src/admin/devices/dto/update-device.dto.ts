import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateDeviceDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  id: number;

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
