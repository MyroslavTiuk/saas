import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ADMIN_LOCATION_LEVEL_USER } from '../../../utils/const';

export class AddManagerDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

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

  @IsNotEmpty()
  @IsEnum(ADMIN_LOCATION_LEVEL_USER)
  admin_location_level_user: ADMIN_LOCATION_LEVEL_USER;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  admin_location_id: number;

  @IsOptional()
  @IsString()
  account_no_desc: string;

  @IsOptional()
  @IsString()
  paypoint_desc: string;
}
