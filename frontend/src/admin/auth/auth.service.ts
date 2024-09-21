import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminCommonService } from '../admin-common/admin-common.service';
import { UserDetailEntity } from '../../database/entities/user-detail.entity';
import { Repository } from 'typeorm';
import { UserEntity } from '../../database/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { compare as CryptoCompare, hash as CryptoHash } from 'bcrypt';
import { ACCESS_PRIVILEGE, FRONT_END_URL, JWT_SECRET } from '../../utils/const';
import { SignInDto } from './dto/sign-in.dto';
import { SignInResponseDto } from './dto/sign-in-response.dto';
import { ForgetPasswordVerifySendDto } from './dto/forget-password-verify-send.dto';
import {
  EmailVerifyCodeEntity,
  EmailVerifyType,
} from '../../database/entities/email-verify-code.entity';
import crypto from 'crypto';
import { generateOTP } from '../../utils/helper';
import { MailerService } from '@nestjs-modules/mailer';
import { ForgetPasswordSetPasswordDto } from './dto/forget-password-set-password.dto';

export const MINUTES_10 = 10 * 60 * 1000;
export const HOURS_24 = 24 * 60 * 60 * 1000;
export const MONTH_1 = HOURS_24 * 30;
export const MONTH_3 = HOURS_24 * 90;

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private mailService: MailerService,
    private adminCommonService: AdminCommonService,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(UserDetailEntity)
    private readonly userDetailRepo: Repository<UserDetailEntity>,
    @InjectRepository(EmailVerifyCodeEntity)
    private readonly emailVerifyCodeRepo: Repository<EmailVerifyCodeEntity>,
  ) {}

  async getTokens(user_id: number, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          id: user_id,
          email: email,
        },
        {
          secret: JWT_SECRET,
          expiresIn: MONTH_1 / 1000,
        },
      ),
      this.jwtService.signAsync(
        {
          id: user_id,
          email: email,
        },
        {
          secret: JWT_SECRET,
          expiresIn: MONTH_3 / 1000,
        },
      ),
    ]);
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async login(params: SignInDto): Promise<SignInResponseDto> {
    const { email, password } = params;
    const exist_user: UserEntity = await this.adminCommonService.getUserByEmail(email);
    if (!exist_user) {
      throw new HttpException('Login failed, user not found', HttpStatus.BAD_REQUEST);
    }
    if (!exist_user.status) {
      throw new HttpException(
        'You have been restricted, please contact your system administrator',
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.verifyPassword(password, exist_user.password);
    const tokens = await this.getTokens(exist_user.id, exist_user.email);
    exist_user.accessToken = tokens.access_token;
    exist_user.refreshToken = tokens.refresh_token;
    exist_user.expiryAccessDate = new Date(Date.now() + MONTH_1);
    exist_user.expiryRefreshDate = new Date(Date.now() + MONTH_3);

    await this.userRepo.save(exist_user);
    return {
      id: Number(exist_user.id),
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expire_in: MONTH_1,
      token_type: 'Bearer',
    };
  }

  async logout(userId: number) {
    const exist_user = await this.adminCommonService.getUserById(userId);
    if (!exist_user) {
      throw new HttpException('The user not found', HttpStatus.BAD_REQUEST);
    }
    exist_user.accessToken = null;
    exist_user.refreshToken = null;
    exist_user.expiryAccessDate = null;
    exist_user.expiryRefreshDate = null;

    await this.userRepo.save(exist_user);
    return { status: 'ok', message: 'success' };
  }

  async refreshTokens(userId: number): Promise<SignInResponseDto> {
    const exist_user = await this.adminCommonService.getUserById(userId);
    if (!exist_user) {
      throw new HttpException('The user not found', HttpStatus.BAD_REQUEST);
    }
    const tokens = await this.getTokens(exist_user.id, exist_user.email);

    exist_user.accessToken = tokens.access_token;
    exist_user.refreshToken = tokens.refresh_token;
    exist_user.expiryAccessDate = new Date(Date.now() + MONTH_1);
    exist_user.expiryRefreshDate = new Date(Date.now() + MONTH_3);

    await this.userRepo.save(exist_user);
    return {
      id: Number(exist_user.id),
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expire_in: MONTH_1,
      token_type: 'Bearer',
    };
  }

  private async verifyPassword(password: string, hashedPassword: string) {
    const isPasswordMatching = await CryptoCompare(password, hashedPassword);
    if (!isPasswordMatching) {
      throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
    }
  }

  async addAdminSeed() {
    let new_user = new UserEntity();
    new_user.email = 'ren222akio@outlook.com';
    new_user.password = await CryptoHash('PT@dev2-23', 10);
    new_user.access_privilege = ACCESS_PRIVILEGE.SUPER_USER;
    new_user = await this.userRepo.save(new_user);

    const user_detail = new UserDetailEntity();
    user_detail.user = new_user;
    user_detail.surname = 'Ren';
    user_detail.given_name = 'Akio';
    user_detail.job_title = 'Developer';
    user_detail.office_phone = '123123123';
    user_detail.mobile_number = '123123123';

    await this.userDetailRepo.save(user_detail);
    return { status: 'ok', message: 'success' };
  }

  // --------------------- Forget Password Part -------------------------
  async forgetPasswordVerifySend(params: ForgetPasswordVerifySendDto) {
    const { email } = params;
    const exist_user = await this.adminCommonService.getUserByEmail(email);
    if (!exist_user) {
      throw new HttpException('Invalid Request', HttpStatus.BAD_REQUEST);
    }
    const user_detail = await this.adminCommonService.getUserDetailByUserId(exist_user.id);
    const exist_token = await this.adminCommonService.getUserEmailVerifyToken(
      email,
      EmailVerifyType.forget_password,
    );
    if (exist_token) {
      if (exist_token.expiryDate.getTime() > Date.now()) {
        throw new HttpException('Please try again 10 minutes later', HttpStatus.BAD_REQUEST);
      }
    }
    let new_verify_token = new EmailVerifyCodeEntity();
    new_verify_token.email = email;
    new_verify_token.code = generateOTP(6);
    new_verify_token.type = EmailVerifyType.forget_password;
    new_verify_token.expiryDate = new Date(Date.now() + MINUTES_10);
    new_verify_token.verifyToken = crypto.randomBytes(10).toString('hex');

    new_verify_token = await this.emailVerifyCodeRepo.save(new_verify_token);
    await this.mailService.sendMail({
      to: email,
      subject: 'Forget Password',
      template: 'forget_password',
      context: {
        url: encodeURI(
          FRONT_END_URL +
            '/resetpassword/' +
            exist_user.email.replaceAll('.', '%dot%') +
            '/' +
            new_verify_token.verifyToken,
        ),
        name: user_detail.surname + ' ' + user_detail.given_name,
      },
    });

    return { status: 'ok', message: 'success' };
  }

  async forgetPasswordSetPassword(params: ForgetPasswordSetPasswordDto) {
    const { email, password, verify_token } = params;
    const exist_user = await this.adminCommonService.getUserByEmail(email);
    if (!exist_user) {
      throw new HttpException('Invalid Request', HttpStatus.BAD_REQUEST);
    }
    const exist_token = await this.adminCommonService.getUserEmailVerifyToken(
      email,
      EmailVerifyType.forget_password,
    );
    if (!exist_token) {
      throw new HttpException('Invalid Request', HttpStatus.BAD_REQUEST);
    }
    if (exist_token.verifyToken !== verify_token) {
      throw new HttpException('Invalid Verify Token', HttpStatus.BAD_REQUEST);
    }
    if (exist_token.expiryDate.getTime() < Date.now()) {
      throw new HttpException('The verify token expired.', HttpStatus.BAD_REQUEST);
    }
    exist_user.password = await CryptoHash(password, 10);
    exist_user.accessToken = null;
    exist_user.refreshToken = null;
    exist_user.expiryAccessDate = null;
    exist_user.expiryRefreshDate = null;

    await this.userRepo.save(exist_user);

    return { status: 'ok', message: 'success' };
  }
  // --------------------- End Forget Password Part ---------------------
}
