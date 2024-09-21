import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ACCESS_PRIVILEGE } from '../../../utils/const';

export class AddAdminUserDto {
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
  @IsEnum(ACCESS_PRIVILEGE)
  access_privilege: ACCESS_PRIVILEGE;

  @IsOptional()
  @IsString()
  admin_desc: string;
}
