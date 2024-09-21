import { Module } from '@nestjs/common';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminCommonModule } from '../admin-common/admin-common.module';
import { AdminLocationEntity } from '../../database/entities/admin_location.entity';
import { EmployeeEntity } from '../../database/entities/employee.entity';
import { UserEntity } from '../../database/entities/user.entity';
import { UserDetailEntity } from '../../database/entities/user-detail.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AdminLocationEntity, EmployeeEntity, UserEntity, UserDetailEntity]),
    AdminCommonModule,
  ],
  controllers: [EmployeeController],
  providers: [EmployeeService],
})
export class EmployeeModule {}
