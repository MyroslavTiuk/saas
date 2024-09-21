import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceEntity } from '../../database/entities/device.entity';
import { PayloadEntity } from '../../database/entities/payload.entity';
import { EmployeeEntity } from '../../database/entities/employee.entity';
import { AttendanceEntity } from '../../database/entities/attendance.entity';
import { AdminLocationEntity } from '../../database/entities/admin_location.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DeviceEntity,
      PayloadEntity,
      EmployeeEntity,
      AttendanceEntity,
      AdminLocationEntity,
    ]),
  ],
  providers: [CommonService],
  exports: [CommonService],
})
export class CommonModule {}
