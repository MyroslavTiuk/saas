import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SuperUserGuard } from '../guard/super-user.guard';
import { DevicesService } from './devices.service';
import { GetDevicesDto } from '../auth/dto/get-devices.dto';
import { AddDeviceDto } from './dto/add-device.dto';
import { UserEntity } from '../../database/entities/user.entity';
import { GetDeviceByIdDto } from './dto/get-device-by-id.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { DeleteDeviceDto } from './dto/delete-device.dto';
import { ChangeDeviceStateDto } from './dto/change-device-state.dto';

@Controller('admin/devices')
export class DevicesController {
  constructor(private readonly deviceService: DevicesService) {}
  @UseGuards(SuperUserGuard)
  @Get('get_devices')
  @HttpCode(HttpStatus.OK)
  get_devices(@Query() params: GetDevicesDto) {
    return this.deviceService.getDevices(params);
  }

  @UseGuards(SuperUserGuard)
  @Get('get_device_by_id')
  @HttpCode(HttpStatus.OK)
  getDevice(@Query() query: GetDeviceByIdDto) {
    return this.deviceService.getDeviceById(query);
  }

  @UseGuards(SuperUserGuard)
  @Post('add_device')
  @HttpCode(HttpStatus.CREATED)
  addDevice(@Req() req: any, @Body() body: AddDeviceDto) {
    const user = <UserEntity>req.user;
    return this.deviceService.addDevice(user, body);
  }
  @UseGuards(SuperUserGuard)
  @Put('update_device')
  @HttpCode(HttpStatus.OK)
  updateDevice(@Body() body: UpdateDeviceDto) {
    return this.deviceService.updateDevice(body);
  }

  @UseGuards(SuperUserGuard)
  @Delete('delete_device')
  @HttpCode(HttpStatus.OK)
  deleteDevice(@Query() query: DeleteDeviceDto) {
    return this.deviceService.deleteDevice(query);
  }

  @UseGuards(SuperUserGuard)
  @Put('change_status')
  @HttpCode(HttpStatus.OK)
  changeStatus(@Body() body: ChangeDeviceStateDto) {
    return this.deviceService.changeDeviceStatus(body);
  }
}
