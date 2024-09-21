import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class ResetPasswordAdminDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  user_id: number;

  @IsNotEmpty()
  @IsString()
  new_password: string;
}
