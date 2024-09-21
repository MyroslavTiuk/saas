import { IsNotEmpty, IsString } from 'class-validator';

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsString()
  old_password: string;

  @IsNotEmpty()
  @IsString()
  new_password: string;
}
