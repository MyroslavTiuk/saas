import { Module } from '@nestjs/common';
import { ExcelController } from './excel.controller';
import { ExcelService } from './excel.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminCommonModule } from '../admin-common/admin-common.module';
import { EmployeeEntity } from '../../database/entities/employee.entity';
import { AdminLocationEntity } from '../../database/entities/admin_location.entity';
import { UserEntity } from '../../database/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([EmployeeEntity, AdminLocationEntity, UserEntity]),
    AdminCommonModule,
  ],
  controllers: [ExcelController],
  providers: [ExcelService],
})
export class ExcelModule {}
