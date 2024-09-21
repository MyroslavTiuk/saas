import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AdminCommonService } from '../admin-common/admin-common.service';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../database/entities/user.entity';
import { Repository } from 'typeorm';
import { UserDetailEntity } from '../../database/entities/user-detail.entity';
import { AdminLocationEntity } from '../../database/entities/admin_location.entity';
import { DeviceEntity } from '../../database/entities/device.entity';
import { GetDevicesDto } from '../auth/dto/get-devices.dto';
import { Sort, SortType } from '../../type/pageable';
import { AddDeviceDto } from './dto/add-device.dto';
import { GetDeviceByIdDto } from './dto/get-device-by-id.dto';
import { generateDeviceProductKey } from '../../utils/helper';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { DeleteDeviceDto } from './dto/delete-device.dto';
import { ChangeDeviceStateDto } from './dto/change-device-state.dto';

@Injectable()
export class DevicesService {
  constructor(
    private readonly adminCommonService: AdminCommonService,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(UserDetailEntity)
    private readonly userDetailRepo: Repository<UserDetailEntity>,
    @InjectRepository(AdminLocationEntity)
    private readonly adminLocationRepo: Repository<AdminLocationEntity>,
    @InjectRepository(DeviceEntity)
    private readonly deviceRepo: Repository<DeviceEntity>,
  ) {}

  async getDevices(params: GetDevicesDto) {
    const { admin_location_id, offset, limit } = params;
    const sort: Sort = {
      field: 'device.createdAt',
      order: SortType.DESC,
    };
    const builder = this.deviceRepo.createQueryBuilder('device');
    builder
      .andWhere('device.admin_location_id = :id', { id: admin_location_id })
      .leftJoinAndSelect('device.creator', 'dc')
      .leftJoinAndSelect('device.admin_location', 'da')
      .orderBy(sort.field, sort.order)
      .offset(offset)
      .limit(limit);
    const [data, count] = await builder.getManyAndCount();
    const rows = [];
    data.map((item) => {
      rows.push({
        id: item.id,
        status: item.status,
        device_name: item.device_name,
        device_id: item.device_id,
        ip_address: item.ip_address,
        make_or_model: item.make_or_model,
        gps_location: item.gps_location,
        admin_location: item.admin_location.admin_location,
        admin_desc: item.admin_location.admin_desc,
        account_no_desc: item.account_no_desc,
        paypoint_desc: item.paypoint_desc,
        creator: item.creator.email,
        created_at: item.createdAt,
        updated_at: item.updatedAt,
      });
    });
    return { status: 'ok', message: 'success', rows: rows, count: count };
  }

  async addDevice(user: UserEntity, params: AddDeviceDto) {
    const {
      admin_location_id,
      device_id,
      device_name,
      make_or_model,
      paypoint_desc,
      account_no_desc,
    } = params;

    const exist_admin_location = await this.adminCommonService.getAdminLocationById(
      admin_location_id,
    );
    if (!exist_admin_location) {
      throw new HttpException('Admin location does not exist', HttpStatus.BAD_REQUEST);
    }

    let new_device = new DeviceEntity();
    new_device.admin_location = exist_admin_location;
    new_device.creator = user;
    new_device.device_id = device_id;
    new_device.device_name = device_name;
    new_device.make_or_model = make_or_model;
    new_device.paypoint_desc = paypoint_desc;
    new_device.account_no_desc = account_no_desc;
    new_device.device_product_key = generateDeviceProductKey();

    new_device = await this.deviceRepo.save(new_device);

    return { status: 'ok', message: 'success', data: { id: new_device.id } };
  }

  async getDeviceById(params: GetDeviceByIdDto) {
    const { device_id } = params;
    const device_info = await this.deviceRepo.findOne(device_id, {
      relations: ['admin_location'],
    });
    if (!device_info) {
      throw new HttpException('Device with that id not exists', HttpStatus.BAD_REQUEST);
    }
    return {
      status: 'ok',
      message: 'success',
      data: {
        device: {
          id: device_info.id,
          device_id: device_info.device_id,
          device_name: device_info.device_name,
          device_product_key: device_info.device_product_key,
          ip_address: device_info.ip_address,
          make_or_model: device_info.make_or_model,
          gps_location: device_info.gps_location,
          account_no_desc: device_info.account_no_desc,
          paypoint_desc: device_info.paypoint_desc,
        },
        admin_location: {
          admin_location: device_info.admin_location.admin_location,
          admin_desc: device_info.admin_location.admin_desc,
        },
      },
    };
  }

  async updateDevice(params: UpdateDeviceDto) {
    const { id, device_name, make_or_model, account_no_desc, paypoint_desc } = params;
    const exist_device = await this.adminCommonService.getDeviceById(id);
    if (!exist_device) {
      throw new HttpException('Device with that id not exists', HttpStatus.BAD_REQUEST);
    }
    exist_device.device_name = device_name;
    exist_device.make_or_model = make_or_model;
    exist_device.account_no_desc = account_no_desc;
    exist_device.paypoint_desc = paypoint_desc;

    await this.deviceRepo.save(exist_device);
    return { status: 'ok', message: 'success' };
  }

  async deleteDevice(params: DeleteDeviceDto) {
    const { device_id } = params;
    const exist_device = await this.adminCommonService.getDeviceById(device_id);
    if (!exist_device) {
      throw new HttpException('Device with that id not exists', HttpStatus.BAD_REQUEST);
    }
    await this.deviceRepo.softDelete(device_id);
    return { status: 'ok', message: 'success' };
  }

  async changeDeviceStatus(params: ChangeDeviceStateDto) {
    const { device_id, status } = params;
    const exist_device = await this.adminCommonService.getDeviceById(device_id);
    if (!exist_device) {
      throw new HttpException('Device with that id not exists', HttpStatus.BAD_REQUEST);
    }
    exist_device.status = status;
    await this.deviceRepo.save(exist_device);
    return { status: 'ok', message: 'success' };
  }
}
