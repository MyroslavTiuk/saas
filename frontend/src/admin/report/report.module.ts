import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminCommonModule } from '../admin-common/admin-common.module';
import { UserEntity } from '../../database/entities/user.entity';
import { UserDetailEntity } from '../../database/entities/user-detail.entity';
import { EmployeeEntity } from '../../database/entities/employee.entity';
import { AttendanceEntity } from '../../database/entities/attendance.entity';
import { AdminLocationEntity } from '../../database/entities/admin_location.entity';
import { PayloadEntity } from '../../database/entities/payload.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      UserDetailEntity,
      EmployeeEntity,
      AttendanceEntity,
      AdminLocationEntity,
      PayloadEntity,
    ]),
    AdminCommonModule,
  ],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}
