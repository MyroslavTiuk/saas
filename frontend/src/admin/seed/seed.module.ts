import { Module } from '@nestjs/common';
import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminCommonModule } from '../admin-common/admin-common.module';
import { UserEntity } from '../../database/entities/user.entity';
import { UserDetailEntity } from '../../database/entities/user-detail.entity';
import { PayloadEntity } from '../../database/entities/payload.entity';
import { EmployeeEntity } from '../../database/entities/employee.entity';
import { DeviceEntity } from '../../database/entities/device.entity';
import { AttendanceEntity } from '../../database/entities/attendance.entity';
import { AdminLocationEntity } from '../../database/entities/admin_location.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      UserDetailEntity,
      PayloadEntity,
      EmployeeEntity,
      DeviceEntity,
      AttendanceEntity,
      AdminLocationEntity,
    ]),
    AdminCommonModule,
  ],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
