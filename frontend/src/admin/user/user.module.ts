import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../database/entities/user.entity';
import { UserDetailEntity } from '../../database/entities/user-detail.entity';
import { AdminCommonModule } from '../admin-common/admin-common.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserDetailEntity]), AdminCommonModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
