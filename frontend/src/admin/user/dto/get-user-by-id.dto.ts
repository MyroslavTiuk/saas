import { IsNotEmpty, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class GetUserByIdDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  user_id: number;
}
