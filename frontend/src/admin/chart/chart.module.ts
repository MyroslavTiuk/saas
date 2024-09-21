import { Module } from '@nestjs/common';
import { ChartController } from './chart.controller';
import { ChartService } from './chart.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendanceEntity } from '../../database/entities/attendance.entity';
import { PayloadEntity } from '../../database/entities/payload.entity';
import { AdminLocationEntity } from '../../database/entities/admin_location.entity';
import { EmployeeEntity } from '../../database/entities/employee.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AttendanceEntity,
      PayloadEntity,
      AdminLocationEntity,
      EmployeeEntity,
    ]),
  ],
  controllers: [ChartController],
  providers: [ChartService],
})
export class ChartModule {}
