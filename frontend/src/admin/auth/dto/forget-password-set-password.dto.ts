import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ForgetPasswordSetPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  verify_token: string;
}
