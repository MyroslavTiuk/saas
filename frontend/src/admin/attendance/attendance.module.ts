import { Module } from '@nestjs/common';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminCommonModule } from '../admin-common/admin-common.module';
import { UserEntity } from '../../database/entities/user.entity';
import { UserDetailEntity } from '../../database/entities/user-detail.entity';
import { EmployeeEntity } from '../../database/entities/employee.entity';
import { AttendanceEntity } from '../../database/entities/attendance.entity';
import { PayloadEntity } from '../../database/entities/payload.entity';
import { AdminLocationEntity } from '../../database/entities/admin_location.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      UserDetailEntity,
      EmployeeEntity,
      AttendanceEntity,
      PayloadEntity,
      AdminLocationEntity,
    ]),
    AdminCommonModule,
  ],
  controllers: [AttendanceController],
  providers: [AttendanceService],
})
export class AttendanceModule {}
