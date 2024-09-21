import { Module } from '@nestjs/common';
import { PayloadController } from './payload.controller';
import { PayloadService } from './payload.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PayloadEntity } from '../../database/entities/payload.entity';
import { AdminLocationEntity } from '../../database/entities/admin_location.entity';
import { UserEntity } from '../../database/entities/user.entity';
import { AdminCommonModule } from '../admin-common/admin-common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PayloadEntity, AdminLocationEntity, UserEntity]),
    AdminCommonModule,
  ],
  controllers: [PayloadController],
  providers: [PayloadService],
})
export class PayloadModule {}
