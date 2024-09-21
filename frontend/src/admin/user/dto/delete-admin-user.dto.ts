import { IsNotEmpty, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class DeleteAdminUserDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  user_id: number;
}
