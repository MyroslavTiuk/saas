import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignInResponseDto } from './dto/sign-in-response.dto';
import { UserGuard } from '../guard/user.guard';
import { UserEntity } from '../../database/entities/user.entity';
import { ForgetPasswordVerifySendDto } from './dto/forget-password-verify-send.dto';
import { ForgetPasswordSetPasswordDto } from './dto/forget-password-set-password.dto';

@Controller('admin/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('add_admin_seed')
  @HttpCode(HttpStatus.OK)
  addAdminSeed() {
    return this.authService.addAdminSeed();
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() body: SignInDto): Promise<SignInResponseDto> {
    return this.authService.login(body);
  }

  @UseGuards(UserGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Req() req: any) {
    const user = <UserEntity>req.user;
    return this.authService.logout(user.id);
  }

  @UseGuards(UserGuard)
  @Post('refresh_token')
  @HttpCode(HttpStatus.OK)
  refreshTokens(@Req() req: any) {
    const user = <UserEntity>req.user;
    return this.authService.refreshTokens(user.id);
  }

  @Post('forget_password/verify-send')
  @HttpCode(HttpStatus.OK)
  forgetPasswordVerifySend(@Body() body: ForgetPasswordVerifySendDto) {
    return this.authService.forgetPasswordVerifySend(body);
  }

  @Post('forget_password/set-password')
  @HttpCode(HttpStatus.OK)
  forgetPasswordSetPassword(@Body() body: ForgetPasswordSetPasswordDto) {
    return this.authService.forgetPasswordSetPassword(body);
  }
}
