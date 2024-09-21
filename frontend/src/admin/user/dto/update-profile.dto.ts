import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateProfileDto {
  @IsNotEmpty()
  @IsString()
  surname: string;

  @IsNotEmpty()
  @IsString()
  given_name: string;

  @IsNotEmpty()
  @IsString()
  job_title: string;

  @IsNotEmpty()
  @IsString()
  office_phone: string;

  @IsNotEmpty()
  @IsString()
  mobile_number: string;
}
