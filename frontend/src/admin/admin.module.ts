import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AdminCommonModule } from './admin-common/admin-common.module';
import { AuthMiddleware } from './middleware/auth.middleware';
import { UserModule } from './user/user.module';
import { AdminLocationModule } from './admin-location/admin-location.module';
import { DevicesModule } from './devices/devices.module';
import { ManagerModule } from './manager/manager.module';
import { SeedModule } from './seed/seed.module';
import { EmployeeModule } from './employee/employee.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ReportModule } from './report/report.module';
import { AttendanceModule } from './attendance/attendance.module';
import { ExcelModule } from './excel/excel.module';
import { PayloadModule } from './payload/payload.module';
import { ChartModule } from './chart/chart.module';

@Module({
  imports: [
    AuthModule,
    AdminCommonModule,
    UserModule,
    AdminLocationModule,
    DevicesModule,
    ManagerModule,
    SeedModule,
    EmployeeModule,
    DashboardModule,
    ReportModule,
    AttendanceModule,
    ExcelModule,
    PayloadModule,
    ChartModule,
  ],
})
export class AdminModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
