import { IsEnum, IsNotEmpty } from 'class-validator';
import { USER_TYPE } from '../../../utils/const';

export class GetAllAdminLocationsByUsertypeDto {
  @IsNotEmpty()
  @IsEnum(USER_TYPE)
  user_type: USER_TYPE;
}
