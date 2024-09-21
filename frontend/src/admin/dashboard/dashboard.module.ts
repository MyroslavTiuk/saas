import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminCommonModule } from '../admin-common/admin-common.module';
import { UserEntity } from '../../database/entities/user.entity';
import { UserDetailEntity } from '../../database/entities/user-detail.entity';
import { DeviceEntity } from '../../database/entities/device.entity';
import { EmployeeEntity } from '../../database/entities/employee.entity';
import { AdminLocationEntity } from '../../database/entities/admin_location.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      UserDetailEntity,
      DeviceEntity,
      EmployeeEntity,
      AdminLocationEntity,
    ]),
    AdminCommonModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
