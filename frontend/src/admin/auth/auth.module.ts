import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../database/entities/user.entity';
import { UserDetailEntity } from '../../database/entities/user-detail.entity';
import { AdminCommonModule } from '../admin-common/admin-common.module';
import { EmailVerifyCodeEntity } from '../../database/entities/email-verify-code.entity';

@Module({
  imports: [
    JwtModule.register({}),
    TypeOrmModule.forFeature([UserEntity, UserDetailEntity, EmailVerifyCodeEntity]),
    AdminCommonModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
