import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { DeviceMiddleware } from './middleware/device.middleware';
import { MobileModule } from './mobile/mobile.module';

@Module({
  imports: [CommonModule, MobileModule],
})
export class ApiModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(DeviceMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
