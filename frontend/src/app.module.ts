import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import {
  MAIL_FROM_ADDRESS,
  MAIL_HOST,
  MAIL_PASSWORD,
  MAIL_PORT,
  MAIL_USERNAME,
} from './utils/const';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminModule } from './admin/admin.module';
import { CommandModule } from 'nestjs-command';
import { ApiModule } from './api/api.module';
import ormConfig from './ormconfig';
import { SyncUserCommand } from './command/sync-user.command';
import { UserEntity } from './database/entities/user.entity';
import { UserDetailEntity } from './database/entities/user-detail.entity';
import { AdminCommonModule } from './admin/admin-common/admin-common.module';
import { AdminLocationEntity } from './database/entities/admin_location.entity';
import { DeviceEntity } from './database/entities/device.entity';
import { SyncDevicesCommand } from './command/sync-devices.command';
import { EmployeeEntity } from './database/entities/employee.entity';
import { SyncEmployeesCommand } from './command/sync-employees.command';
import { AttendanceEntity } from './database/entities/attendance.entity';
import { SyncAttendancesCommand } from './command/sync-attendances.command';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MailerModule.forRoot({
      transport: {
        host: MAIL_HOST,
        port: MAIL_PORT,
        auth: {
          user: MAIL_USERNAME,
          pass: MAIL_PASSWORD,
        },
      },
      defaults: {
        from: MAIL_FROM_ADDRESS,
      },
      template: {
        dir: join(__dirname, 'mail/templates'),
        adapter: new HandlebarsAdapter(),
        options: { strict: true },
      },
    }),
    TypeOrmModule.forRoot(ormConfig),
    ThrottlerModule.forRoot({
      ttl: 30,
      limit: 150,
    }),
    AdminModule,
    ApiModule,
    TypeOrmModule.forFeature([
      UserEntity,
      UserDetailEntity,
      AdminLocationEntity,
      DeviceEntity,
      EmployeeEntity,
      AttendanceEntity,
    ]),
    AdminCommonModule,
    CommandModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    SyncUserCommand,
    SyncDevicesCommand,
    SyncEmployeesCommand,
    SyncAttendancesCommand,
  ],
})
export class AppModule {}
