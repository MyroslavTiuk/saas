import { Injectable } from '@nestjs/common';
import { Command, Positional } from 'nestjs-command';
import fs from 'fs';
import { join } from 'path';
import process from 'process';
import { AdminCommonService } from '../admin/admin-common/admin-common.service';
import { InjectRepository } from '@nestjs/typeorm';
import { DeviceEntity } from '../database/entities/device.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SyncDevicesCommand {
  constructor(
    private adminCommonService: AdminCommonService,
    @InjectRepository(DeviceEntity)
    private readonly deviceRepo: Repository<DeviceEntity>,
  ) {}
  @Command({
    command: 'sync:devices <file>',
    describe: 'Sync Device with json file',
  })
  async syncDevices(
    @Positional({
      name: 'file',
      describe: 'file name',
      type: 'string',
    })
    file: string,
  ) {
    const response = fs
      .readFileSync(join(process.cwd(), './uploads/sync/' + file), 'utf-8')
      .toString();
    const json = JSON.parse(response);
    const creator = await this.adminCommonService.getUserById(1);
    const devices: DeviceEntity[] = [];
    json.RECORDS.map((item: any) => {
      const new_device = new DeviceEntity();
      new_device.admin_location_id = item.admin_location_id;
      new_device.device_id = item.device_id;
      new_device.device_product_key = item.device_product_key;
      new_device.device_name = item.device_name;
      new_device.make_or_model = item.make_or_model;
      new_device.gps_location = item.gps_location;
      new_device.account_no_desc = item.account_no_desc;
      new_device.paypoint_desc = item.paypoint_desc;
      new_device.status = item.status == 'Enabled';
      new_device.creator = creator;
      devices.push(new_device);
    });
    await this.deviceRepo.save(devices);
    console.log('Command End Point');
  }
}
