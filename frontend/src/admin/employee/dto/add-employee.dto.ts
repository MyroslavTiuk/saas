import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { GENDER } from '../../../utils/const';

export class AddEmployeeDto {
  @IsNotEmpty()
  @IsString()
  employee_no: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  admin_location_id: number;

  @IsNotEmpty()
  @IsString()
  name_report: string;

  @IsNotEmpty()
  @IsString()
  position_no: string;

  @IsNotEmpty()
  @IsString()
  occup_pos_title: string;

  @IsNotEmpty()
  @IsString()
  award: string;

  @IsNotEmpty()
  @IsString()
  award_desc: string;

  @IsNotEmpty()
  @IsString()
  classification: string;

  @IsNotEmpty()
  @IsString()
  class_desc: string;

  @IsNotEmpty()
  @IsString()
  step_no: string;

  @IsNotEmpty()
  @IsString()
  occup_type: string;

  @IsNotEmpty()
  @IsEnum(GENDER)
  gender: GENDER;

  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  first_commence: Date;

  @IsNotEmpty()
  @IsString()
  account_no: string;

  @IsNotEmpty()
  @IsString()
  account_no_desc: string;

  @IsNotEmpty()
  @IsString()
  emp_status: string;

  @IsNotEmpty()
  @IsString()
  paypoint: string;

  @IsNotEmpty()
  @IsString()
  paypoint_desc: string;

  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  date_of_birth: Date;

  @IsNotEmpty()
  @IsString()
  occup_pos_cat: string;
}
