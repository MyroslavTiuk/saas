import { IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class ChangeUserStateDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  user_id: number;

  @IsNotEmpty()
  @IsBoolean()
  @Type(() => Boolean)
  status: boolean;
}
