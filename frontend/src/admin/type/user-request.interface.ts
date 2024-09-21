import { Request } from 'express';
import { UserEntity } from '../../database/entities/user.entity';
export interface UserRequestInterface extends Request {
  user?: UserEntity;
}
