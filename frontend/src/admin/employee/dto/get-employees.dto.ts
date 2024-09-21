import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { LIMIT_AT_ONCE } from '../../../utils/const';

export class GetEmployeesDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  admin_location_id: number;

  @IsNotEmpty()
  @IsNumber()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  @Max(LIMIT_AT_ONCE)
  limit: number;

  @IsOptional()
  @IsNumber()
  @IsInt()
  @Type(() => Number)
  offset: number;

  @IsOptional()
  @IsString()
  account_no_desc: string;

  @IsOptional()
  @IsString()
  paypoint_desc: string;
}
