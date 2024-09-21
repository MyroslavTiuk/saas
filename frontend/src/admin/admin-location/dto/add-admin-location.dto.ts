import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { USER_TYPE } from '../../../utils/const';

export class AddAdminLocationDto {
  @IsNotEmpty()
  @IsString()
  admin_location: string;

  @IsNotEmpty()
  @IsString()
  admin_desc: string;

  @IsNotEmpty()
  @IsEnum(USER_TYPE)
  user_type: USER_TYPE;
}
