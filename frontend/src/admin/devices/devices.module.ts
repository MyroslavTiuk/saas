import { Module } from '@nestjs/common';
import { DevicesController } from './devices.controller';
import { DevicesService } from './devices.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../database/entities/user.entity';
import { UserDetailEntity } from '../../database/entities/user-detail.entity';
import { AdminLocationEntity } from '../../database/entities/admin_location.entity';
import { DeviceEntity } from '../../database/entities/device.entity';
import { AdminCommonModule } from '../admin-common/admin-common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, UserDetailEntity, AdminLocationEntity, DeviceEntity]),
    AdminCommonModule,
  ],
  controllers: [DevicesController],
  providers: [DevicesService],
})
export class DevicesModule {}
