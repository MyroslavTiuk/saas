import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AdminCommonService } from '../admin-common/admin-common.service';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../database/entities/user.entity';
import { Brackets, Repository } from 'typeorm';
import { UserDetailEntity } from '../../database/entities/user-detail.entity';
import { AddAdminUserDto } from './dto/add-admin-user.dto';
import { compare as CryptoCompare, hash as CryptoHash } from 'bcrypt';
import { GetAllUserDto } from './dto/get-all-user.dto';
import { Sort, SortType } from '../../type/pageable';
import { ChangeUserStateDto } from './dto/change-user-state.dto';
import { GetUserByIdDto } from './dto/get-user-by-id.dto';
import { UpdateAdminUserDto } from './dto/update-admin-user.dto';
import { DeleteAdminUserDto } from './dto/delete-admin-user.dto';
import { ResetPasswordAdminDto } from './dto/reset-password-admin.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ACCESS_PRIVILEGE } from '../../utils/const';

@Injectable()
export class UserService {
  constructor(
    private readonly adminCommonService: AdminCommonService,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(UserDetailEntity)
    private readonly userDetailRepo: Repository<UserDetailEntity>,
  ) {}

  async getMe(userId: number) {
    const user_info = await this.userRepo.findOne(userId, {
      relations: ['userDetail', 'admin_location'],
    });
    if (!user_info) {
      throw new HttpException('User with that id not exists', HttpStatus.BAD_REQUEST);
    }
    return {
      status: 'ok',
      message: 'success',
      data: {
        id: user_info.id,
        email: user_info.email,
        access_privilege: user_info.access_privilege,
        admin_location_level_user: user_info.admin_location_level_user,
        creator: user_info.creator,
        surname: user_info.userDetail.surname,
        given_name: user_info.userDetail.given_name,
        job_title: user_info.userDetail.job_title,
        office_phone: user_info.userDetail.office_phone,
        mobile_number: user_info.userDetail.mobile_number,
        admin_desc: user_info.userDetail.admin_desc,
        account_no_desc: user_info.userDetail.account_no_desc,
        paypoint_desc: user_info.userDetail.paypoint_desc,
        created_at: user_info.createdAt,
        updated_at: user_info.updatedAt,
        admin_location:
          user_info.admin_location == null
            ? null
            : {
                admin_location_id: user_info.admin_location.id,
                admin_location: user_info.admin_location.admin_location,
                admin_desc: user_info.admin_location.admin_location,
                user_type: user_info.admin_location.user_type,
              },
      },
    };
  }

  async getAllUsers(params: GetAllUserDto) {
    const { search, limit, offset } = params;
    const sort: Sort = {
      field: 'user.id',
      order: SortType.ASC,
    };
    const builder = this.userRepo.createQueryBuilder('user').select();
    if (search) {
      builder.where(
        new Brackets((subQuery) => {
          subQuery.orWhere(`user.email LIKE '%${search}%'`);
          subQuery.orWhere(`ud.surname LIKE '%${search}%'`);
          subQuery.orWhere(`ud.given_name LIKE '%${search}%'`);
        }),
      );
    }
    builder
      // .andWhere('user.admin_location_level_user IS NULL')
      .where('user.access_privilege IS NOT NULL')
      .leftJoinAndSelect('user.userDetail', 'ud')
      .orderBy(sort.field, sort.order)
      .offset(offset)
      .withDeleted()
      .limit(limit);
    const [data, count] = await builder.getManyAndCount();
    const rows = [];
    data.map((item) => {
      rows.push({
        id: item.id,
        email: item.email,
        access_privilege: item.access_privilege,
        status: item.status,
        surname: item.userDetail.surname,
        given_name: item.userDetail.given_name,
        job_title: item.userDetail.job_title,
        creator: item.creator,
        admin_desc: item.userDetail.admin_desc,
        office_phone: item.userDetail.office_phone,
        mobile_number: item.userDetail.mobile_number,
        created_at: item.createdAt,
        updated_at: item.updatedAt,
        deleted_at: item.deletedAt,
      });
    });
    return { status: 'ok', message: 'success', rows: rows, count: count };
  }

  async addAdminUser(user: UserEntity, params: AddAdminUserDto) {
    const {
      email,
      password,
      surname,
      given_name,
      job_title,
      office_phone,
      mobile_number,
      access_privilege,
      admin_desc,
    } = params;
    const exist_user = await this.adminCommonService.getUserByEmail(email);
    if (exist_user) {
      throw new HttpException('User with that email already exists', HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await CryptoHash(password, 10);
    let new_user = new UserEntity();
    new_user.email = email.toLowerCase();
    new_user.password = hashedPassword;
    new_user.access_privilege = access_privilege;
    new_user.creator = user.email;
    new_user = await this.userRepo.save(new_user);
    const user_detail = new UserDetailEntity();
    user_detail.user = new_user;
    user_detail.surname = surname;
    user_detail.given_name = given_name;
    user_detail.job_title = job_title;
    user_detail.office_phone = office_phone;
    user_detail.mobile_number = mobile_number;
    if (admin_desc && admin_desc != '') {
      user_detail.admin_desc = admin_desc;
    }

    await this.userDetailRepo.save(user_detail);

    return { status: 'ok', message: 'success' };
  }

  async updateAdminUser(params: UpdateAdminUserDto) {
    const { id, surname, given_name, job_title, office_phone, mobile_number } = params;
    const exist_user = await this.adminCommonService.getUserById(id);
    if (!exist_user) {
      throw new HttpException('User with that id not exists', HttpStatus.BAD_REQUEST);
    }

    const user_detail = await this.adminCommonService.getUserDetailByUserId(id);
    if (!user_detail) {
      throw new HttpException('Invalid Request', HttpStatus.BAD_REQUEST);
    }
    user_detail.surname = surname;
    user_detail.given_name = given_name;
    user_detail.job_title = job_title;
    user_detail.office_phone = office_phone;
    user_detail.mobile_number = mobile_number;

    await this.userRepo.save(exist_user);
    await this.userDetailRepo.save(user_detail);

    return { status: 'ok', message: 'success' };
  }

  async deleteAdminUser(params: DeleteAdminUserDto) {
    const { user_id } = params;
    const exist_user = await this.adminCommonService.getUserById(user_id);
    if (!exist_user) {
      throw new HttpException('User with that id not exists', HttpStatus.BAD_REQUEST);
    }
    await this.userRepo.softDelete(user_id);
    return { status: 'ok', message: 'success' };
  }

  async restoreAdminUser(params: DeleteAdminUserDto) {
    const { user_id } = params;
    const exist_user = await this.adminCommonService.getUserById(user_id, true);
    if (!exist_user) {
      throw new HttpException('User with that id not exists', HttpStatus.BAD_REQUEST);
    }
    await this.userRepo.restore(user_id);
    return { status: 'ok', message: 'success' };
  }

  async changeUserStatus(params: ChangeUserStateDto) {
    const { user_id, status } = params;
    const exist_user = await this.adminCommonService.getUserById(user_id);
    if (!exist_user) {
      throw new HttpException('User with that id not exists', HttpStatus.BAD_REQUEST);
    }
    exist_user.status = status;
    await this.userRepo.save(exist_user);
    return { status: 'ok', message: 'success' };
  }

  async getUserById(params: GetUserByIdDto) {
    const { user_id } = params;
    const user_info = await this.userRepo.findOne(user_id, {
      relations: ['userDetail'],
      withDeleted: true,
    });
    if (!user_info) {
      throw new HttpException('User with that id not exists', HttpStatus.BAD_REQUEST);
    }
    return {
      status: 'ok',
      message: 'success',
      data: {
        id: user_info.id,
        email: user_info.email,
        status: user_info.status,
        access_privilege: user_info.access_privilege,
        creator: user_info.creator,
        surname: user_info.userDetail.surname,
        given_name: user_info.userDetail.given_name,
        job_title: user_info.userDetail.job_title,
        office_phone: user_info.userDetail.office_phone,
        mobile_number: user_info.userDetail.mobile_number,
        created_at: user_info.createdAt,
        updated_at: user_info.updatedAt,
        deleted_at: user_info.deletedAt,
      },
    };
  }

  async resetPasswordAdmin(params: ResetPasswordAdminDto) {
    const { user_id, new_password } = params;
    const exist_user = await this.adminCommonService.getUserById(user_id);
    if (!exist_user) {
      throw new HttpException('User with that id not exists', HttpStatus.BAD_REQUEST);
    }
    exist_user.password = await CryptoHash(new_password, 10);
    await this.userRepo.save(exist_user);

    return { status: 'ok', message: 'success' };
  }

  async resetPassword(user_id: number, params: ResetPasswordDto) {
    const { old_password, new_password } = params;
    const exist_user = await this.adminCommonService.getUserById(user_id);
    if (!exist_user) {
      throw new HttpException('User with that id not exists', HttpStatus.BAD_REQUEST);
    }
    await this.verifyPassword(old_password, exist_user.password);
    exist_user.password = await CryptoHash(new_password, 10);
    await this.userRepo.save(exist_user);

    return { status: 'ok', message: 'success' };
  }

  async updateProfile(user_id: number, params: UpdateProfileDto) {
    const { surname, given_name, job_title, office_phone, mobile_number } = params;
    const exist_user = await this.adminCommonService.getUserById(user_id);
    if (!exist_user) {
      throw new HttpException('User with that id not exists', HttpStatus.BAD_REQUEST);
    }

    const user_detail = await this.adminCommonService.getUserDetailByUserId(user_id);
    if (!user_detail) {
      throw new HttpException('Invalid Request', HttpStatus.BAD_REQUEST);
    }
    user_detail.surname = surname;
    user_detail.given_name = given_name;
    user_detail.job_title = job_title;
    user_detail.office_phone = office_phone;
    user_detail.mobile_number = mobile_number;

    await this.userRepo.save(exist_user);
    await this.userDetailRepo.save(user_detail);

    return { status: 'ok', message: 'success' };
  }

  private async verifyPassword(password: string, hashedPassword: string) {
    const isPasswordMatching = await CryptoCompare(password, hashedPassword);
    if (!isPasswordMatching) {
      throw new HttpException('Wrong old password', HttpStatus.BAD_REQUEST);
    }
  }
}
