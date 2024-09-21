import { Module } from '@nestjs/common';
import { MobileController } from './mobile.controller';
import { MobileService } from './mobile.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from '../common/common.module';
import { DeviceEntity } from '../../database/entities/device.entity';
import { EmployeeEntity } from '../../database/entities/employee.entity';
import { PayloadEntity } from '../../database/entities/payload.entity';
import { AttendanceEntity } from '../../database/entities/attendance.entity';
import { AdminLocationEntity } from '../../database/entities/admin_location.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DeviceEntity,
      EmployeeEntity,
      PayloadEntity,
      AttendanceEntity,
      AdminLocationEntity,
    ]),
    CommonModule,
  ],
  controllers: [MobileController],
  providers: [MobileService],
})
export class MobileModule {}
