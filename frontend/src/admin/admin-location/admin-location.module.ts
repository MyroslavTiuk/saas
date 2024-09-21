import { Module } from '@nestjs/common';
import { AdminLocationService } from './admin-location.service';
import { AdminLocationController } from './admin-location.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminCommonModule } from '../admin-common/admin-common.module';
import { AdminLocationEntity } from '../../database/entities/admin_location.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AdminLocationEntity]), AdminCommonModule],
  providers: [AdminLocationService],
  controllers: [AdminLocationController],
})
export class AdminLocationModule {}
