import { IsNotEmpty, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class GetAccountNoDescListDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  admin_location_id: number;
}
