import { Module } from '@nestjs/common';
import { ManagerController } from './manager.controller';
import { ManagerService } from './manager.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../database/entities/user.entity';
import { UserDetailEntity } from '../../database/entities/user-detail.entity';
import { AdminLocationEntity } from '../../database/entities/admin_location.entity';
import { AdminCommonModule } from '../admin-common/admin-common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, UserDetailEntity, AdminLocationEntity]),
    AdminCommonModule,
  ],
  controllers: [ManagerController],
  providers: [ManagerService],
})
export class ManagerModule {}
