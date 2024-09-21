import { IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class ChangeDeviceStateDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  device_id: number;

  @IsNotEmpty()
  @IsBoolean()
  @Type(() => Boolean)
  status: boolean;
}
