import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { LIMIT_AT_ONCE } from '../../../utils/const';

export class GetAllUserDto {
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
  search: string;
}
