import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateAdminUserDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  id: number;

  @IsNotEmpty()
  @IsString()
  surname: string;

  @IsNotEmpty()
  @IsString()
  given_name: string;

  @IsNotEmpty()
  @IsString()
  job_title: string;

  @IsNotEmpty()
  @IsString()
  office_phone: string;

  @IsNotEmpty()
  @IsString()
  mobile_number: string;
}
