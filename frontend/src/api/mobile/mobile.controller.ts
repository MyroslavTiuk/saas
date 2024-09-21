import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { DeviceLoginDto } from './dto/device-login.dto';
import { MobileService } from './mobile.service';
import { DeviceGuard } from '../guard/device.guard';
import { DeviceGetEmployeesDto } from './dto/device-get-employees.dto';
import { DeviceEntity } from '../../database/entities/device.entity';
import { DeviceClockInDto } from './dto/device-clock-in.dto';
import { DeviceClockOutDto } from './dto/device-clock-out.dto';

@Controller('api/mobile')
export class MobileController {
  constructor(private readonly mobileService: MobileService) {}

  @Get('get_status')
  @HttpCode(HttpStatus.OK)
  getStatus() {
    return {
      status: 'ok',
    };
  }
  @Post('device_login')
  @HttpCode(HttpStatus.OK)
  deviceLogin(@Body() body: DeviceLoginDto) {
    return this.mobileService.deviceLogin(body);
  }

  @UseGuards(DeviceGuard)
  @Get('get_employees')
  @HttpCode(HttpStatus.OK)
  getEmployees(@Req() req: any, @Query() query: DeviceGetEmployeesDto) {
    const device = <DeviceEntity>req.device;
    return this.mobileService.getEmployees(device, query);
  }

  @UseGuards(DeviceGuard)
  @Post('clock_in')
  @HttpCode(HttpStatus.OK)
  clockIn(@Req() req: any, @Body() body: DeviceClockInDto) {
    const device = <DeviceEntity>req.device;
    return this.mobileService.clockIn(device, body);
  }

  @UseGuards(DeviceGuard)
  @Post('clock_out')
  @HttpCode(HttpStatus.OK)
  clockOut(@Req() req: any, @Body() body: DeviceClockOutDto) {
    const device = <DeviceEntity>req.device;
    return this.mobileService.clockOut(device, body);
  }
}
