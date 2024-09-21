import { IsInt, IsNotEmpty, IsNumber, IsOptional, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { LIMIT_AT_ONCE } from '../../../utils/const';

export class GetManagersDto {
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
}
