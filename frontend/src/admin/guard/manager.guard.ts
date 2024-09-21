import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { UserRequestInterface } from '../type/user-request.interface';
import { ACCESS_PRIVILEGE } from '../../utils/const';

export class ManagerGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<UserRequestInterface>();
    if (
      request.user &&
      request.user.status &&
      (request.user.access_privilege == ACCESS_PRIVILEGE.SUPER_USER ||
        request.user.access_privilege == ACCESS_PRIVILEGE.BUREAUCRAT_USER)
    ) {
      return true;
    }
    throw new HttpException('Not authorized', HttpStatus.UNAUTHORIZED);
  }
}
