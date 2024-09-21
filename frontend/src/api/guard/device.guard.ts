import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { DeviceRequestInterface } from '../type/device-request.interface';

export class DeviceGuard extends AuthGuard('device') {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<DeviceRequestInterface>();
    if (request.device && request.device.status) {
      return true;
    }
    throw new HttpException('Not authorized', HttpStatus.UNAUTHORIZED);
  }
}
