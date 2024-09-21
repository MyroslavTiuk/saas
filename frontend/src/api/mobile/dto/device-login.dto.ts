import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class DeviceLoginDto {
  @IsNotEmpty()
  @IsString()
  device_id: string;

  @IsNotEmpty()
  @IsString()
  device_product_key: string;

  @IsOptional()
  @IsString()
  ip_address: string;
}
