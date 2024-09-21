import { Module } from '@nestjs/common';
import { AdminCommonService } from './admin-common.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../database/entities/user.entity';
import { UserDetailEntity } from '../../database/entities/user-detail.entity';
import { PayloadEntity } from '../../database/entities/payload.entity';
import { EmployeeEntity } from '../../database/entities/employee.entity';
import { DeviceEntity } from '../../database/entities/device.entity';
import { AttendanceEntity } from '../../database/entities/attendance.entity';
import { AdminLocationEntity } from '../../database/entities/admin_location.entity';
import { EmailVerifyCodeEntity } from '../../database/entities/email-verify-code.entity';

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
      EmailVerifyCodeEntity,
    ]),
  ],
  providers: [AdminCommonService],
  exports: [AdminCommonService],
})
export class AdminCommonModule {}
