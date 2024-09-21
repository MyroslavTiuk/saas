import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { AdminLocationEntity } from './admin_location.entity';
import { DeviceEntity } from './device.entity';
import { EmployeeEntity } from './employee.entity';
import { UserDetailEntity } from './user-detail.entity';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'bigint', nullable: true })
  admin_location_id: number;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'password', nullable: true })
  password: string;

  @Column({ default: true })
  status: boolean;

  @Column({ nullable: true })
  access_privilege: string;

  @Column({ nullable: true })
  admin_location_level_user: string;

  @Column({ nullable: true })
  creator: string;

  @Column({ default: false })
  verified: boolean;

  @Column({ name: 'verified_at', type: 'datetime', nullable: true })
  verifiedAt?: Date;

  @Column({ name: 'access_token', nullable: true })
  accessToken: string;

  @Column({ name: 'refresh_token', nullable: true })
  refreshToken: string;

  @Column({ name: 'expiry_access_date', type: 'datetime', nullable: true })
  expiryAccessDate: Date;

  @Column({ name: 'expiry_refresh_date', type: 'datetime', nullable: true })
  expiryRefreshDate: Date;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt?: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'datetime', nullable: true })
  deletedAt?: Date;

  @OneToOne(() => UserDetailEntity, (d) => d.user)
  userDetail: UserDetailEntity;

  @ManyToOne(() => AdminLocationEntity, (a) => a.users)
  @JoinColumn({ name: 'admin_location_id' })
  admin_location?: AdminLocationEntity;

  @OneToMany(() => AdminLocationEntity, (a) => a.creator)
  admin_locations_by_me: AdminLocationEntity[];

  @OneToMany(() => DeviceEntity, (a) => a.creator)
  devices_by_me: AdminLocationEntity[];

  @OneToMany(() => EmployeeEntity, (e) => e.creator)
  employees_by_me: EmployeeEntity[];

  @OneToMany(() => EmployeeEntity, (e) => e.archive_user)
  archived_by_me: EmployeeEntity[];
}
