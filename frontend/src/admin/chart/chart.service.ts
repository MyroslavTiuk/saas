import { Injectable } from '@nestjs/common';
import { ChartDailyDto } from './dto/chart-daily.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EmployeeEntity } from '../../database/entities/employee.entity';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { AttendanceEntity } from '../../database/entities/attendance.entity';
import { AdminLocationEntity } from '../../database/entities/admin_location.entity';
import { PayloadEntity } from '../../database/entities/payload.entity';
import { getDateList, HMSToSeconds, zeroPad } from '../../utils/helper';
import moment from 'moment';
import { ChartWeeklyDto } from './dto/chart-weekly.dto';
import { ChartMonthlyDto } from './dto/chart-monthly.dto';
import { USER_TYPE } from '../../utils/const';

@Injectable()
export class ChartService {
  constructor(
    @InjectRepository(PayloadEntity)
    private readonly payloadRepo: Repository<PayloadEntity>,
    @InjectRepository(EmployeeEntity)
    private readonly employeeRepo: Repository<EmployeeEntity>,
    @InjectRepository(AttendanceEntity)
    private readonly attendanceRepo: Repository<AttendanceEntity>,
    @InjectRepository(AdminLocationEntity)
    private readonly adminLocationRepo: Repository<AdminLocationEntity>,
  ) {}

  async getManagerChartDaily(params: ChartDailyDto) {
    const { date } = params;
    const target = new Date(date);
    const start_at = new Date(target.getFullYear(), target.getMonth(), 1);
    const end_at = new Date(target.getFullYear(), target.getMonth() + 1, 0);
    const dateList = getDateList(start_at, end_at);
    const rows = [];
    dateList.map((item) => {
      rows.push({
        date: moment(item).format('YYYY-MM-DD'),
        count: 0,
        avg: 0,
      });
    });
    const attendanceBuilder = this.attendanceRepo.createQueryBuilder('attendance');
    attendanceBuilder
      .andWhere('attendance.date >= :startDate', {
        startDate: moment(start_at).format('YYYY-MM-DD'),
      })
      .andWhere('attendance.date <= :endDate', { endDate: moment(end_at).format('YYYY-MM-DD') })
      .andWhere('attendance.worked_hours != :workTime', { workTime: '00:00:00' });
    const attendances = await attendanceBuilder.getMany();
    attendances.map((item) => {
      const key = moment.utc(new Date(item.date)).format('YYYY-MM-DD');
      const index = rows.findIndex((item) => item.date == key);
      if (index != -1) {
        rows[index].count = rows[index].count + 1;
        rows[index].avg = rows[index].avg + HMSToSeconds(item.worked_hours);
      }
    });
    return rows;
  }

  async getManagerChartWeekly(params: ChartWeeklyDto) {
    const { year } = params;
    const start_at = new Date(year, 0, 1);
    const end_at = new Date(year, 11, 31);
    const rows = [];
    const weeks = moment(start_at).weeksInYear();
    for (let i = 1; i <= weeks; i++) {
      rows.push({
        date: year.toString() + '-' + zeroPad(i),
        count: 0,
        avg: 0,
      });
    }
    const attendanceBuilder = this.attendanceRepo.createQueryBuilder('attendance');
    attendanceBuilder
      .andWhere('attendance.date >= :startDate', {
        startDate: moment(start_at).format('YYYY-MM-DD'),
      })
      .andWhere('attendance.date <= :endDate', { endDate: moment(end_at).format('YYYY-MM-DD') })
      .andWhere('attendance.worked_hours != :workTime', { workTime: '00:00:00' });
    const attendances = await attendanceBuilder.getMany();
    attendances.map((item) => {
      const key = year + '-' + zeroPad(moment(new Date(item.date)).weeks());
      const index = rows.findIndex((item) => item.date == key);
      if (index != -1) {
        rows[index].count = rows[index].count + 1;
        rows[index].avg = rows[index].avg + HMSToSeconds(item.worked_hours);
      }
    });
    return rows;
  }

  async getManagerChartMonthly(params: ChartMonthlyDto) {
    const { year } = params;
    const start_at = new Date(year, 0, 1);
    const end_at = new Date(year, 11, 31);
    const rows = [];
    for (let i = 1; i <= 12; i++) {
      rows.push({
        date: year.toString() + '-' + zeroPad(i),
        count: 0,
        avg: 0,
      });
    }
    const attendanceBuilder = this.attendanceRepo.createQueryBuilder('attendance');
    attendanceBuilder
      .andWhere('attendance.date >= :startDate', {
        startDate: moment(start_at).format('YYYY-MM-DD'),
      })
      .andWhere('attendance.date <= :endDate', { endDate: moment(end_at).format('YYYY-MM-DD') })
      .andWhere('attendance.worked_hours != :workTime', { workTime: '00:00:00' });
    const attendances = await attendanceBuilder.getMany();
    attendances.map((item) => {
      const key = year + '-' + zeroPad(moment(new Date(item.date)).month());
      const index = rows.findIndex((item) => item.date == key);
      if (index != -1) {
        rows[index].count = rows[index].count + 1;
        rows[index].avg = rows[index].avg + HMSToSeconds(item.worked_hours);
      }
    });
    return rows;
  }

  async getManagerChartFortnightly() {
    const currentPayload = await this.payloadRepo.findOne({
      where: {
        start_at: LessThanOrEqual(new Date()),
        end_at: MoreThanOrEqual(new Date()),
      },
    });
    const payloads = await this.payloadRepo.find({
      where: {
        id: LessThanOrEqual(currentPayload.id),
      },
    });

    const rows = [];
    payloads.map((item) => {
      rows.push({
        date: moment(new Date(item.start_at)).format('YYYY-MM-DD'),
        pay_no: item.pay_no,
        count: 0,
        avg: 0,
      });
    });
    const attendanceBuilder = this.attendanceRepo.createQueryBuilder('attendance');
    attendanceBuilder.andWhere('attendance.worked_hours != :workTime', { workTime: '00:00:00' });
    const attendances = await attendanceBuilder.getMany();
    attendances.map((item) => {
      const workDate: Date = new Date(item.date);
      const key = payloads.findIndex(
        (payload) =>
          payload.start_at.getTime() <= workDate.getTime() &&
          payload.end_at.getTime() >= workDate.getTime(),
      );
      if (key != -1) {
        const index = rows.findIndex((row) => row.pay_no == payloads[key].pay_no);
        if (index != -1) {
          rows[index].count = rows[index].count + 1;
          rows[index].avg = rows[index].avg + HMSToSeconds(item.worked_hours);
        }
      }
    });
    return rows;
  }

  async getNonTeacherChartDaily(params: ChartDailyDto) {
    const { date } = params;
    const target = new Date(date);
    const start_at = new Date(target.getFullYear(), target.getMonth(), 1);
    const end_at = new Date(target.getFullYear(), target.getMonth() + 1, 0);
    const dateList = getDateList(start_at, end_at);
    const rows = [];
    dateList.map((item) => {
      rows.push({
        date: moment(item).format('YYYY-MM-DD'),
        count: 0,
        avg: 0,
      });
    });
    const attendanceBuilder = this.attendanceRepo.createQueryBuilder('attendance');
    attendanceBuilder
      .andWhere('attendance.date >= :startDate', {
        startDate: moment(start_at).format('YYYY-MM-DD'),
      })
      .andWhere('attendance.date <= :endDate', { endDate: moment(end_at).format('YYYY-MM-DD') })
      .andWhere('attendance.worked_hours != :workTime', { workTime: '00:00:00' })
      .andWhere('admin.user_type = :non_teacher', { non_teacher: USER_TYPE.NON_TEACHER })
      .leftJoin('attendance.employee', 'emp')
      .leftJoinAndSelect('emp.admin_location', 'admin');

    const attendances = await attendanceBuilder.getMany();
    attendances.map((item) => {
      const key = moment.utc(new Date(item.date)).format('YYYY-MM-DD');
      const index = rows.findIndex((item) => item.date == key);
      if (index != -1) {
        rows[index].count = rows[index].count + 1;
        rows[index].avg = rows[index].avg + HMSToSeconds(item.worked_hours);
      }
    });
    return rows;
  }

  async getNonTeacherChartWeekly(params: ChartWeeklyDto) {
    const { year } = params;
    const start_at = new Date(year, 0, 1);
    const end_at = new Date(year, 11, 31);
    const rows = [];
    const weeks = moment(start_at).weeksInYear();
    for (let i = 1; i <= weeks; i++) {
      rows.push({
        date: year.toString() + '-' + zeroPad(i),
        count: 0,
        avg: 0,
      });
    }
    const attendanceBuilder = this.attendanceRepo.createQueryBuilder('attendance');
    attendanceBuilder
      .andWhere('attendance.date >= :startDate', {
        startDate: moment(start_at).format('YYYY-MM-DD'),
      })
      .andWhere('attendance.date <= :endDate', { endDate: moment(end_at).format('YYYY-MM-DD') })
      .andWhere('attendance.worked_hours != :workTime', { workTime: '00:00:00' })
      .andWhere('admin.user_type = :non_teacher', { non_teacher: USER_TYPE.NON_TEACHER })
      .leftJoin('attendance.employee', 'emp')
      .leftJoinAndSelect('emp.admin_location', 'admin');
    const attendances = await attendanceBuilder.getMany();
    attendances.map((item) => {
      const key = year + '-' + zeroPad(moment(new Date(item.date)).weeks());
      const index = rows.findIndex((item) => item.date == key);
      if (index != -1) {
        rows[index].count = rows[index].count + 1;
        rows[index].avg = rows[index].avg + HMSToSeconds(item.worked_hours);
      }
    });
    return rows;
  }

  async getNonTeacherChartMonthly(params: ChartMonthlyDto) {
    const { year } = params;
    const start_at = new Date(year, 0, 1);
    const end_at = new Date(year, 11, 31);
    const rows = [];
    for (let i = 1; i <= 12; i++) {
      rows.push({
        date: year.toString() + '-' + zeroPad(i),
        count: 0,
        avg: 0,
      });
    }
    const attendanceBuilder = this.attendanceRepo.createQueryBuilder('attendance');
    attendanceBuilder
      .andWhere('attendance.date >= :startDate', {
        startDate: moment(start_at).format('YYYY-MM-DD'),
      })
      .andWhere('attendance.date <= :endDate', { endDate: moment(end_at).format('YYYY-MM-DD') })
      .andWhere('attendance.worked_hours != :workTime', { workTime: '00:00:00' })
      .andWhere('admin.user_type = :non_teacher', { non_teacher: USER_TYPE.NON_TEACHER })
      .leftJoin('attendance.employee', 'emp')
      .leftJoinAndSelect('emp.admin_location', 'admin');
    const attendances = await attendanceBuilder.getMany();
    attendances.map((item) => {
      const key = year + '-' + zeroPad(moment(new Date(item.date)).month());
      const index = rows.findIndex((item) => item.date == key);
      if (index != -1) {
        rows[index].count = rows[index].count + 1;
        rows[index].avg = rows[index].avg + HMSToSeconds(item.worked_hours);
      }
    });
    return rows;
  }

  async getNonTeacherChartFortnightly() {
    const currentPayload = await this.payloadRepo.findOne({
      where: {
        start_at: LessThanOrEqual(new Date()),
        end_at: MoreThanOrEqual(new Date()),
      },
    });
    const payloads = await this.payloadRepo.find({
      where: {
        id: LessThanOrEqual(currentPayload.id),
      },
    });

    const rows = [];
    payloads.map((item) => {
      rows.push({
        date: moment(new Date(item.start_at)).format('YYYY-MM-DD'),
        pay_no: item.pay_no,
        count: 0,
        avg: 0,
      });
    });
    const attendanceBuilder = this.attendanceRepo.createQueryBuilder('attendance');
    attendanceBuilder
      .andWhere('attendance.worked_hours != :workTime', { workTime: '00:00:00' })
      .andWhere('admin.user_type = :non_teacher', { non_teacher: USER_TYPE.NON_TEACHER })
      .leftJoin('attendance.employee', 'emp')
      .leftJoinAndSelect('emp.admin_location', 'admin');
    const attendances = await attendanceBuilder.getMany();
    attendances.map((item) => {
      const workDate: Date = new Date(item.date);
      const key = payloads.findIndex(
        (payload) =>
          payload.start_at.getTime() <= workDate.getTime() &&
          payload.end_at.getTime() >= workDate.getTime(),
      );
      if (key != -1) {
        const index = rows.findIndex((row) => row.pay_no == payloads[key].pay_no);
        if (index != -1) {
          rows[index].count = rows[index].count + 1;
          rows[index].avg = rows[index].avg + HMSToSeconds(item.worked_hours);
        }
      }
    });
    return rows;
  }

  async getTeacherChartDaily(params: ChartDailyDto) {
    const { date } = params;
    const target = new Date(date);
    const start_at = new Date(target.getFullYear(), target.getMonth(), 1);
    const end_at = new Date(target.getFullYear(), target.getMonth() + 1, 0);
    const dateList = getDateList(start_at, end_at);
    const rows = [];
    dateList.map((item) => {
      rows.push({
        date: moment(item).format('YYYY-MM-DD'),
        count: 0,
        avg: 0,
      });
    });
    const attendanceBuilder = this.attendanceRepo.createQueryBuilder('attendance');
    attendanceBuilder
      .andWhere('attendance.date >= :startDate', {
        startDate: moment(start_at).format('YYYY-MM-DD'),
      })
      .andWhere('attendance.date <= :endDate', { endDate: moment(end_at).format('YYYY-MM-DD') })
      .andWhere('attendance.worked_hours != :workTime', { workTime: '00:00:00' })
      .andWhere('admin.user_type = :non_teacher', { non_teacher: USER_TYPE.TEACHER })
      .leftJoin('attendance.employee', 'emp')
      .leftJoinAndSelect('emp.admin_location', 'admin');

    const attendances = await attendanceBuilder.getMany();
    attendances.map((item) => {
      const key = moment.utc(new Date(item.date)).format('YYYY-MM-DD');
      const index = rows.findIndex((item) => item.date == key);
      if (index != -1) {
        rows[index].count = rows[index].count + 1;
        rows[index].avg = rows[index].avg + HMSToSeconds(item.worked_hours);
      }
    });
    return rows;
  }

  async getTeacherChartWeekly(params: ChartWeeklyDto) {
    const { year } = params;
    const start_at = new Date(year, 0, 1);
    const end_at = new Date(year, 11, 31);
    const rows = [];
    const weeks = moment(start_at).weeksInYear();
    for (let i = 1; i <= weeks; i++) {
      rows.push({
        date: year.toString() + '-' + zeroPad(i),
        count: 0,
        avg: 0,
      });
    }
    const attendanceBuilder = this.attendanceRepo.createQueryBuilder('attendance');
    attendanceBuilder
      .andWhere('attendance.date >= :startDate', {
        startDate: moment(start_at).format('YYYY-MM-DD'),
      })
      .andWhere('attendance.date <= :endDate', { endDate: moment(end_at).format('YYYY-MM-DD') })
      .andWhere('attendance.worked_hours != :workTime', { workTime: '00:00:00' })
      .andWhere('admin.user_type = :non_teacher', { non_teacher: USER_TYPE.TEACHER })
      .leftJoin('attendance.employee', 'emp')
      .leftJoinAndSelect('emp.admin_location', 'admin');
    const attendances = await attendanceBuilder.getMany();
    attendances.map((item) => {
      const key = year + '-' + zeroPad(moment(new Date(item.date)).weeks());
      const index = rows.findIndex((item) => item.date == key);
      if (index != -1) {
        rows[index].count = rows[index].count + 1;
        rows[index].avg = rows[index].avg + HMSToSeconds(item.worked_hours);
      }
    });
    return rows;
  }

  async getTeacherChartMonthly(params: ChartMonthlyDto) {
    const { year } = params;
    const start_at = new Date(year, 0, 1);
    const end_at = new Date(year, 11, 31);
    const rows = [];
    for (let i = 1; i <= 12; i++) {
      rows.push({
        date: year.toString() + '-' + zeroPad(i),
        count: 0,
        avg: 0,
      });
    }
    const attendanceBuilder = this.attendanceRepo.createQueryBuilder('attendance');
    attendanceBuilder
      .andWhere('attendance.date >= :startDate', {
        startDate: moment(start_at).format('YYYY-MM-DD'),
      })
      .andWhere('attendance.date <= :endDate', { endDate: moment(end_at).format('YYYY-MM-DD') })
      .andWhere('attendance.worked_hours != :workTime', { workTime: '00:00:00' })
      .andWhere('admin.user_type = :non_teacher', { non_teacher: USER_TYPE.TEACHER })
      .leftJoin('attendance.employee', 'emp')
      .leftJoinAndSelect('emp.admin_location', 'admin');
    const attendances = await attendanceBuilder.getMany();
    attendances.map((item) => {
      const key = year + '-' + zeroPad(moment(new Date(item.date)).month());
      const index = rows.findIndex((item) => item.date == key);
      if (index != -1) {
        rows[index].count = rows[index].count + 1;
        rows[index].avg = rows[index].avg + HMSToSeconds(item.worked_hours);
      }
    });
    return rows;
  }

  async getTeacherChartFortnightly() {
    const currentPayload = await this.payloadRepo.findOne({
      where: {
        start_at: LessThanOrEqual(new Date()),
        end_at: MoreThanOrEqual(new Date()),
      },
    });
    const payloads = await this.payloadRepo.find({
      where: {
        id: LessThanOrEqual(currentPayload.id),
      },
    });

    const rows = [];
    payloads.map((item) => {
      rows.push({
        date: moment(new Date(item.start_at)).format('YYYY-MM-DD'),
        pay_no: item.pay_no,
        count: 0,
        avg: 0,
      });
    });
    const attendanceBuilder = this.attendanceRepo.createQueryBuilder('attendance');
    attendanceBuilder
      .andWhere('attendance.worked_hours != :workTime', { workTime: '00:00:00' })
      .andWhere('admin.user_type = :non_teacher', { non_teacher: USER_TYPE.TEACHER })
      .leftJoin('attendance.employee', 'emp')
      .leftJoinAndSelect('emp.admin_location', 'admin');
    const attendances = await attendanceBuilder.getMany();
    attendances.map((item) => {
      const workDate: Date = new Date(item.date);
      const key = payloads.findIndex(
        (payload) =>
          payload.start_at.getTime() <= workDate.getTime() &&
          payload.end_at.getTime() >= workDate.getTime(),
      );
      if (key != -1) {
        const index = rows.findIndex((row) => row.pay_no == payloads[key].pay_no);
        if (index != -1) {
          rows[index].count = rows[index].count + 1;
          rows[index].avg = rows[index].avg + HMSToSeconds(item.worked_hours);
        }
      }
    });
    return rows;
  }
}
