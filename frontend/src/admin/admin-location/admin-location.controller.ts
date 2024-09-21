import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AdminLocationService } from './admin-location.service';
import { SuperUserGuard } from '../guard/super-user.guard';
import { UserEntity } from '../../database/entities/user.entity';
import { AddAdminLocationDto } from './dto/add-admin-location.dto';
import { UserGuard } from '../guard/user.guard';
import { GetAllAdminLocationsByUsertypeDto } from './dto/get-all-admin-locations-by-usertype.dto';
import { GetAdminLocationIdDto } from './dto/get-admin-location-id.dto';
import { UpdateAdminLocationDto } from './dto/update-admin-location.dto';

@Controller('admin/admin-location')
export class AdminLocationController {
  constructor(private readonly adminLocationService: AdminLocationService) {}

  @UseGuards(SuperUserGuard)
  @Post('add')
  @HttpCode(HttpStatus.CREATED)
  add(@Req() req: any, @Body() body: AddAdminLocationDto) {
    const user = <UserEntity>req.user;
    return this.adminLocationService.addAdminLocation(user, body);
  }

  @UseGuards(SuperUserGuard)
  @Get('get_all')
  @HttpCode(HttpStatus.OK)
  get_all() {
    return this.adminLocationService.getAll();
  }

  @UseGuards(UserGuard)
  @Get('get_all_by_usertype')
  @HttpCode(HttpStatus.OK)
  get_all_by_usertype(@Req() req: any, @Query() body: GetAllAdminLocationsByUsertypeDto) {
    const user = <UserEntity>req.user;
    return this.adminLocationService.getLocationByUserType(user, body);
  }

  @UseGuards(UserGuard)
  @Get('get')
  @HttpCode(HttpStatus.OK)
  getById(@Query() query: GetAdminLocationIdDto) {
    return this.adminLocationService.getLocationById(query);
  }

  @UseGuards(SuperUserGuard)
  @Put('update')
  @HttpCode(HttpStatus.OK)
  update(@Body() body: UpdateAdminLocationDto) {
    return this.adminLocationService.updateAdminLocation(body);
  }
}
