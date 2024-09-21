import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateAdminLocationDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  id: number;

  @IsNotEmpty()
  @IsString()
  admin_location: string;

  @IsNotEmpty()
  @IsString()
  admin_desc: string;
}
