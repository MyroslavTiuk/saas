import { Injectable } from '@nestjs/common';
import { AdminCommonService } from '../admin-common/admin-common.service';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../database/entities/user.entity';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { PayloadEntity } from '../../database/entities/payload.entity';
import { AdminLocationEntity } from '../../database/entities/admin_location.entity';
import moment from 'moment/moment';

@Injectable()
export class PayloadService {
  constructor(
    private readonly adminCommonService: AdminCommonService,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(PayloadEntity)
    private readonly payloadRepo: Repository<PayloadEntity>,
    @InjectRepository(AdminLocationEntity)
    private readonly adminLocationRepo: Repository<AdminLocationEntity>,
  ) {}

  async getPayloads() {
    const currentPayload = await this.payloadRepo.findOne({
      where: {
        start_at: LessThanOrEqual(new Date()),
        end_at: MoreThanOrEqual(new Date()),
      },
    });
    const payloads = await this.payloadRepo
      .createQueryBuilder('payload')
      .where('payload.id >= 26')
      .andWhere('payload.id <= :id', { id: currentPayload.id })
      .getMany();

    const rows = [];
    payloads.map((item) => {
      rows.push({
        label: `Pay ${item.pay_no} - ${moment(item.end_at).format('YYYY')}`,
        id: item.id,
        pay_no: item.pay_no,
      });
    });

    return { status: 'ok', message: 'success', data: rows };
  }
}
