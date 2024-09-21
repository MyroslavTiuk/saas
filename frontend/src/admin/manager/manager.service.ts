import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AdminCommonService } from '../admin-common/admin-common.service';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../database/entities/user.entity';
import { Repository } from 'typeorm';
import { UserDetailEntity } from '../../database/entities/user-detail.entity';
import { AdminLocationEntity } from '../../database/entities/admin_location.entity';
import { GetManagersDto } from './dto/get-managers.dto';
import { Sort, SortType } from '../../type/pageable';
import { AddManagerDto } from './dto/add-manager.dto';
import { ADMIN_LOCATION_LEVEL_USER } from '../../utils/const';
import { hash as CryptoHash } from 'bcrypt';
import { GetManagerByIdDto } from './dto/get-manager-by-id.dto';
import { DeleteAdminUserDto } from '../user/dto/delete-admin-user.dto';

@Injectable()
export class ManagerService {
  constructor(
    private readonly adminCommonService: AdminCommonService,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(UserDetailEntity)
    private readonly userDetailRepo: Repository<UserDetailEntity>,
    @InjectRepository(AdminLocationEntity)
    private readonly adminLocationRepo: Repository<AdminLocationEntity>,
  ) {}

  async getManagers(params: GetManagersDto) {
    const { admin_location_id, limit, offset } = params;
    const sort: Sort = {
      field: 'user.createdAt',
      order: SortType.DESC,
    };
    const admin_location = await this.adminCommonService.getAdminLocationById(admin_location_id);
    if (!admin_location) {
      throw new HttpException('Admin location does not exist', HttpStatus.BAD_REQUEST);
    }
    const builder = this.userRepo.createQueryBuilder('user');
    builder
      .where('user.admin_location_id = :id', { id: admin_location_id })
      .leftJoinAndSelect('user.userDetail', 'ud')
      .leftJoinAndSelect('user.admin_location', 'ua')
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
        status: item.status,
        admin_location_level_user: item.admin_location_level_user,
        surname: item.userDetail.surname,
        given_name: item.userDetail.given_name,
        job_title: item.userDetail.job_title,
        creator: item.creator,
        admin_location: item.admin_location.admin_location,
        admin_desc: item.admin_location.admin_desc,
        account_no_desc: item.userDetail.account_no_desc,
        paypoint_desc: item.userDetail.paypoint_desc,
        office_phone: item.userDetail.office_phone,
        mobile_number: item.userDetail.mobile_number,
        created_at: item.createdAt,
        updated_at: item.updatedAt,
        deleted_at: item.deletedAt,
      });
    });
    return { status: 'ok', message: 'success', rows: rows, count: count };
  }

  async addManager(user: UserEntity, params: AddManagerDto) {
    const {
      email,
      password,
      surname,
      given_name,
      job_title,
      office_phone,
      mobile_number,
      admin_location_level_user,
      admin_location_id,
      account_no_desc,
      paypoint_desc,
    } = params;
    const exist_user = await this.adminCommonService.getUserByEmail(email);
    if (exist_user) {
      throw new HttpException('Manager with that email already exists', HttpStatus.BAD_REQUEST);
    }
    const admin_location = await this.adminCommonService.getAdminLocationById(admin_location_id);
    if (!admin_location) {
      throw new HttpException('Admin location does not exist', HttpStatus.BAD_REQUEST);
    }
    if (
      admin_location_level_user == ADMIN_LOCATION_LEVEL_USER.ACCOUNT_NO_DESC_USER &&
      account_no_desc == ''
    ) {
      throw new HttpException('Please insert the account no desc', HttpStatus.BAD_REQUEST);
    }

    if (
      admin_location_level_user == ADMIN_LOCATION_LEVEL_USER.PAYPOINT_DESC_USER &&
      account_no_desc == ''
    ) {
      throw new HttpException('Please insert the account no desc', HttpStatus.BAD_REQUEST);
    }

    if (
      admin_location_level_user == ADMIN_LOCATION_LEVEL_USER.PAYPOINT_DESC_USER &&
      paypoint_desc == ''
    ) {
      throw new HttpException('Please insert the paypoint desc', HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await CryptoHash(password, 10);
    let new_manager = new UserEntity();
    new_manager.email = email.toLowerCase();
    new_manager.password = hashedPassword;
    new_manager.admin_location_level_user = admin_location_level_user;
    new_manager.admin_location = admin_location;
    new_manager.creator = user.email;
    new_manager = await this.userRepo.save(new_manager);
    const manager_detail = new UserDetailEntity();
    manager_detail.user = new_manager;
    manager_detail.surname = surname;
    manager_detail.given_name = given_name;
    manager_detail.job_title = job_title;
    manager_detail.office_phone = office_phone;
    manager_detail.mobile_number = mobile_number;
    manager_detail.admin_desc = admin_location.admin_desc;
    if (
      admin_location_level_user == ADMIN_LOCATION_LEVEL_USER.ACCOUNT_NO_DESC_USER ||
      admin_location_level_user == ADMIN_LOCATION_LEVEL_USER.PAYPOINT_DESC_USER
    ) {
      manager_detail.account_no_desc = account_no_desc;
    }
    if (admin_location_level_user == ADMIN_LOCATION_LEVEL_USER.PAYPOINT_DESC_USER) {
      manager_detail.paypoint_desc = paypoint_desc;
    }
    await this.userDetailRepo.save(manager_detail);

    return { status: 'ok', message: 'success' };
  }

  async getManagerById(params: GetManagerByIdDto) {
    const { manager_id } = params;
    const user_info = await this.userRepo.findOne(manager_id, {
      relations: ['userDetail', 'admin_location'],
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
        admin_location_level_user: user_info.admin_location_level_user,
        creator: user_info.creator,
        surname: user_info.userDetail.surname,
        given_name: user_info.userDetail.given_name,
        job_title: user_info.userDetail.job_title,
        office_phone: user_info.userDetail.office_phone,
        mobile_number: user_info.userDetail.mobile_number,
        admin_location: user_info.admin_location.admin_location,
        admin_desc: user_info.admin_location.admin_desc,
        account_no_desc: user_info.userDetail.account_no_desc,
        paypoint_desc: user_info.userDetail.paypoint_desc,
        created_at: user_info.createdAt,
        updated_at: user_info.updatedAt,
        deleted_at: user_info.deletedAt,
      },
    };
  }

  async deleteAdminLocationUser(params: DeleteAdminUserDto) {
    const { user_id } = params;
    const exist_user = await this.adminCommonService.getUserById(user_id);
    if (!exist_user) {
      throw new HttpException('User with that id not exists', HttpStatus.BAD_REQUEST);
    }
    await this.userRepo.softDelete(user_id);
    return { status: 'ok', message: 'success' };
  }

  async restoreAdminLocationUser(params: DeleteAdminUserDto) {
    const { user_id } = params;
    const exist_user = await this.adminCommonService.getUserById(user_id, true);
    if (!exist_user) {
      throw new HttpException('User with that id not exists', HttpStatus.BAD_REQUEST);
    }
    await this.userRepo.restore(user_id);
    return { status: 'ok', message: 'success' };
  }
}
