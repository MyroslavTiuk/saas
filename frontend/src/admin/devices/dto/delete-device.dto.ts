import { IsNotEmpty, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class DeleteDeviceDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  device_id: number;
}
