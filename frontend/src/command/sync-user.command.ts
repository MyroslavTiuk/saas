import { Injectable } from '@nestjs/common';
import { Command, Positional } from 'nestjs-command';
import * as fs from 'fs';
import { join } from 'path';
import * as process from 'process';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../database/entities/user.entity';
import { Repository } from 'typeorm';
import { UserDetailEntity } from '../database/entities/user-detail.entity';
import { AdminCommonService } from '../admin/admin-common/admin-common.service';
import { hash as CryptoHash } from 'bcrypt';
import { AdminLocationEntity } from '../database/entities/admin_location.entity';

@Injectable()
export class SyncUserCommand {
  constructor(
    private adminCommonService: AdminCommonService,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(UserDetailEntity)
    private readonly userDetailRepo: Repository<UserDetailEntity>,
    @InjectRepository(AdminLocationEntity)
    private readonly adminLocationRepo: Repository<AdminLocationEntity>,
  ) {}
  @Command({
    command: 'sync:users <file>',
    describe: 'Sync Users with json file',
  })
  async syncUsers(
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
    const creator = await this.adminCommonService.getUserById(1);
    const json = JSON.parse(response);
    const password = await CryptoHash('PT@dev2-23', 10);
    for (let index = 0; index < json.RECORDS.length; index++) {
      const item = json.RECORDS[index];
      if (item.access_privilege == 'Bureaucrat User') {
        let new_user = new UserEntity();
        new_user.email = item.email;
        new_user.password = password;
        new_user.access_privilege = item.access_privilege != '' ? item.access_privilege : null;
        new_user.admin_location_level_user = item.admin_location_level_user;
        new_user.status = item.status == 'Active';
        new_user.creator = creator.email;
        if (item.admin_location_level_user != null) {
          const admin_location = await this.adminLocationRepo.findOne({
            where: { admin_desc: item.admin_desc },
          });
          if (admin_location) {
            new_user.admin_location = admin_location;
          }
        }
        new_user = await this.userRepo.save(new_user);
        const user_detail = new UserDetailEntity();
        user_detail.user = new_user;
        user_detail.surname = item.surname;
        user_detail.given_name = item.given_name;
        user_detail.job_title = item.job_title;
        user_detail.office_phone = item.office_phone;
        user_detail.mobile_number = item.mobile_number;
        user_detail.admin_desc = item.admin_desc;
        user_detail.account_no_desc = item.account_no_desc != '' ? item.account_no_desc : null;
        user_detail.paypoint_desc = item.paypoint_desc != '' ? item.paypoint_desc : null;

        await this.userDetailRepo.save(user_detail);
      }
    }
    console.log('Command End Point');
  }
}
