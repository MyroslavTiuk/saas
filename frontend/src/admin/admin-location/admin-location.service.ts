import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AdminCommonService } from '../admin-common/admin-common.service';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminLocationEntity } from '../../database/entities/admin_location.entity';
import { Repository } from 'typeorm';
import { UserEntity } from '../../database/entities/user.entity';
import { AddAdminLocationDto } from './dto/add-admin-location.dto';
import { GetAllAdminLocationsByUsertypeDto } from './dto/get-all-admin-locations-by-usertype.dto';
import { Sort, SortType } from '../../type/pageable';
import { GetAdminLocationIdDto } from './dto/get-admin-location-id.dto';
import { UpdateAdminLocationDto } from './dto/update-admin-location.dto';

@Injectable()
export class AdminLocationService {
  constructor(
    private readonly adminCommonService: AdminCommonService,
    @InjectRepository(AdminLocationEntity)
    private readonly adminLocationRepo: Repository<AdminLocationEntity>,
  ) {}

  async addAdminLocation(user: UserEntity, params: AddAdminLocationDto) {
    const { admin_location, admin_desc, user_type } = params;
    const existLocation = await this.adminLocationRepo
      .createQueryBuilder()
      .where('admin_location = :admin_location', { admin_location })
      .orWhere('user_type = :user_type', { user_type })
      .getOne();
    if (existLocation) {
      throw new HttpException(
        'Admin location with usertype already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    const new_admin_location = new AdminLocationEntity();
    new_admin_location.creator = user;
    new_admin_location.admin_location = admin_location;
    new_admin_location.admin_desc = admin_desc;
    new_admin_location.user_type = user_type;

    await this.adminLocationRepo.save(new_admin_location);

    return { status: 'ok', message: 'success' };
  }

  async getAll() {
    const sort: Sort = {
      field: 'admin_location',
      order: SortType.ASC,
    };
    const builder = this.adminLocationRepo.createQueryBuilder();
    builder.orderBy(sort.field, sort.order);
    const results = await builder.getMany();
    return { status: 'ok', message: 'success', data: results };
  }

  async getLocationByUserType(user: UserEntity, params: GetAllAdminLocationsByUsertypeDto) {
    const { user_type } = params;
    const sort: Sort = {
      field: 'id',
      order: SortType.ASC,
    };
    const builder = this.adminLocationRepo.createQueryBuilder();
    if (user.admin_location_id != null) {
      builder.where('id = :admin_location_id', { admin_location_id: user.admin_location_id });
    }
    builder.andWhere('user_type = :user_type', { user_type });
    builder.orderBy(sort.field, sort.order);
    const results = await builder.getMany();
    return { status: 'ok', message: 'success', data: results };
  }

  async getLocationById(query: GetAdminLocationIdDto) {
    const { admin_location_id } = query;
    const admin_location = await this.adminCommonService.getAdminLocationById(admin_location_id);
    if (!admin_location) {
      throw new HttpException('Admin location does not exist', HttpStatus.BAD_REQUEST);
    }
    return { status: 'ok', message: 'success', data: admin_location };
  }

  async updateAdminLocation(params: UpdateAdminLocationDto) {
    const { id, admin_location, admin_desc } = params;
    const exist_admin_location = await this.adminCommonService.getAdminLocationById(id);
    if (!exist_admin_location) {
      throw new HttpException('Admin location does not exist', HttpStatus.BAD_REQUEST);
    }
    const existByName = await this.adminLocationRepo
      .createQueryBuilder()
      .where('admin_location = :admin_location', { admin_location })
      .orWhere('user_type = :user_type', { user_type: exist_admin_location.user_type })
      .getOne();
    if (existByName) {
      throw new HttpException(
        'Admin location with usertype already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
    exist_admin_location.admin_location = admin_location;
    exist_admin_location.admin_desc = admin_desc;

    await this.adminLocationRepo.save(exist_admin_location);
    return { status: 'ok', message: 'success' };
  }
}
