import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { GENDER } from '../../../utils/const';
import { Transform, Type } from 'class-transformer';

export class UpdateEmployeeDto {
  @IsNotEmpty()
  @IsString()
  employee_no: string;

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
