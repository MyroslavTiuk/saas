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
import { ManagerService } from './manager.service';
import { SuperUserGuard } from '../guard/super-user.guard';
import { GetManagersDto } from './dto/get-managers.dto';
import { UserEntity } from '../../database/entities/user.entity';
import { AddManagerDto } from './dto/add-manager.dto';
import { GetManagerByIdDto } from './dto/get-manager-by-id.dto';
import { DeleteAdminUserDto } from '../user/dto/delete-admin-user.dto';

@Controller('admin/manager')
export class ManagerController {
  constructor(private readonly managerService: ManagerService) {}

  @UseGuards(SuperUserGuard)
  @Get('get_managers')
  @HttpCode(HttpStatus.OK)
  getManagers(@Query() params: GetManagersDto) {
    return this.managerService.getManagers(params);
  }

  @UseGuards(SuperUserGuard)
  @Post('add_manager')
  @HttpCode(HttpStatus.CREATED)
  addManager(@Req() req: any, @Body() body: AddManagerDto) {
    const user = <UserEntity>req.user;
    return this.managerService.addManager(user, body);
  }

  @UseGuards(SuperUserGuard)
  @Get('get_manager')
  @HttpCode(HttpStatus.OK)
  getManager(@Query() query: GetManagerByIdDto) {
    return this.managerService.getManagerById(query);
  }

  @UseGuards(SuperUserGuard)
  @Delete('delete_admin_location_user')
  @HttpCode(HttpStatus.OK)
  deleteAdminLocationUser(@Query() query: DeleteAdminUserDto) {
    return this.managerService.deleteAdminLocationUser(query);
  }

  @UseGuards(SuperUserGuard)
  @Put('restore_admin_location_user')
  restoreAdminLocationUser(@Body() body: DeleteAdminUserDto) {
    return this.managerService.restoreAdminLocationUser(body);
  }
}
