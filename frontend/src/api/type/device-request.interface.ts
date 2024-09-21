import { Request } from 'express';
import { DeviceEntity } from '../../database/entities/device.entity';

export interface DeviceRequestInterface extends Request {
  device?: DeviceEntity;
}
