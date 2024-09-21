import { Injectable, NestMiddleware } from '@nestjs/common';
import { CommonService } from '../common/common.service';
import { DeviceRequestInterface } from '../type/device-request.interface';
import { NextFunction } from 'express';
import { DeviceEntity } from '../../database/entities/device.entity';

@Injectable()
export class DeviceMiddleware implements NestMiddleware {
  constructor(private readonly commonService: CommonService) {}

  async use(req: DeviceRequestInterface, res: Response, next: NextFunction) {
    const device_code: string = req.headers['device_code'] as string;
    const device_product_key: string = req.headers['device_product_key'] as string;
    if (!device_code || !device_product_key) {
      req.device = null;
      next();
      return;
    }
    try {
      const device: DeviceEntity | null = await this.commonService.getDeviceByHeader(
        device_code,
        device_product_key,
      );
      if (device) {
        req.device = device;
        next();
      } else {
        req.device = null;
        next();
      }
    } catch (e) {
      req.device = null;
      next();
    }
  }
}
