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
import { UserGuard } from '../guard/user.guard';
import { UserService } from './user.service';
import { UserEntity } from '../../database/entities/user.entity';
import { AddAdminUserDto } from './dto/add-admin-user.dto';
import { SuperUserGuard } from '../guard/super-user.guard';
import { GetAllUserDto } from './dto/get-all-user.dto';
import { ChangeUserStateDto } from './dto/change-user-state.dto';
import { GetUserByIdDto } from './dto/get-user-by-id.dto';
import { UpdateAdminUserDto } from './dto/update-admin-user.dto';
import { DeleteAdminUserDto } from './dto/delete-admin-user.dto';
import { ResetPasswordAdminDto } from './dto/reset-password-admin.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('admin/user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @UseGuards(UserGuard)
  @Get('me')
  @HttpCode(HttpStatus.OK)
  me(@Req() req: any) {
    const user = <UserEntity>req.user;
    return this.userService.getMe(user.id);
  }

  @UseGuards(SuperUserGuard)
  @Get('get_all_users')
  @HttpCode(HttpStatus.OK)
  get_all_users(@Query() params: GetAllUserDto) {
    return this.userService.getAllUsers(params);
  }

  @UseGuards(SuperUserGuard)
  @Post('add_admin_user')
  @HttpCode(HttpStatus.CREATED)
  addUser(@Req() req: any, @Body() body: AddAdminUserDto) {
    const user = <UserEntity>req.user;
    return this.userService.addAdminUser(user, body);
  }

  @UseGuards(SuperUserGuard)
  @Put('change_status')
  @HttpCode(HttpStatus.OK)
  changeStatus(@Body() body: ChangeUserStateDto) {
    return this.userService.changeUserStatus(body);
  }

  @UseGuards(SuperUserGuard)
  @Get('get_user')
  @HttpCode(HttpStatus.OK)
  getUser(@Query() query: GetUserByIdDto) {
    return this.userService.getUserById(query);
  }

  @UseGuards(SuperUserGuard)
  @Put('update_admin_user')
  @HttpCode(HttpStatus.OK)
  updateUser(@Body() body: UpdateAdminUserDto) {
    return this.userService.updateAdminUser(body);
  }

  @UseGuards(SuperUserGuard)
  @Delete('delete_admin_user')
  @HttpCode(HttpStatus.OK)
  deleteUser(@Query() query: DeleteAdminUserDto) {
    return this.userService.deleteAdminUser(query);
  }

  @UseGuards(SuperUserGuard)
  @Put('restore_admin_user')
  restoreUser(@Body() body: DeleteAdminUserDto) {
    return this.userService.restoreAdminUser(body);
  }

  @UseGuards(SuperUserGuard)
  @Post('reset_password_admin')
  @HttpCode(HttpStatus.OK)
  resetPasswordAdmin(@Body() body: ResetPasswordAdminDto) {
    return this.userService.resetPasswordAdmin(body);
  }

  @UseGuards(UserGuard)
  @Put('update_profile')
  @HttpCode(HttpStatus.OK)
  updateProfile(@Req() req: any, @Body() body: UpdateProfileDto) {
    const user = <UserEntity>req.user;
    return this.userService.updateProfile(user.id, body);
  }

  @UseGuards(UserGuard)
  @Post('reset_password')
  @HttpCode(HttpStatus.OK)
  resetPassword(@Req() req: any, @Body() body: ResetPasswordDto) {
    const user = <UserEntity>req.user;
    return this.userService.resetPassword(user.id, body);
  }
}
