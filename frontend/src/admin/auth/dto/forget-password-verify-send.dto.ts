import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgetPasswordVerifySendDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
