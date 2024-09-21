import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { AdminLocationEntity } from './admin_location.entity';
import { UserEntity } from './user.entity';
import { AttendanceEntity } from './attendance.entity';

@Entity({ name: 'devices' })
export class DeviceEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'bigint' })
  admin_location_id: number;

  @Column({ unique: true })
  device_id: string;

  @Column({ unique: true })
  device_product_key: string;

  @Column({ nullable: true })
  device_name: string;

  @Column({ nullable: true })
  make_or_model: string;

  @Column({ nullable: true })
  gps_location: string;

  @Column({ nullable: true })
  account_no_desc: string;

  @Column({ nullable: true })
  paypoint_desc: string;

  @Column({ nullable: true })
  ip_address: string;

  @Column({ default: true })
  status: boolean;

  @Column({ type: 'bigint' })
  created_by: number;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt?: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'datetime', nullable: true })
  deletedAt?: Date;

  @ManyToOne(() => AdminLocationEntity, (a) => a.devices)
  @JoinColumn({ name: 'admin_location_id' })
  admin_location: AdminLocationEntity;

  @ManyToOne(() => UserEntity, (u) => u.devices_by_me)
  @JoinColumn({ name: 'created_by' })
  creator: UserEntity;

  @OneToMany(() => AttendanceEntity, (a) => a.clockInDevice)
  attendances: AttendanceEntity[];

  @OneToMany(() => AttendanceEntity, (a) => a.clockOutDevice)
  clockOutAttendances: AttendanceEntity[];
}
