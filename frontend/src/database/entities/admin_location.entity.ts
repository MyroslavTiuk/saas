import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  JoinColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { DeviceEntity } from './device.entity';
import { EmployeeEntity } from './employee.entity';

@Entity({ name: 'admin_locations' })
@Index(['admin_location', 'user_type'], { unique: true })
export class AdminLocationEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  admin_location: string;

  @Column()
  admin_desc: string;

  @Column()
  user_type: string;

  @Column({ type: 'bigint' })
  created_by: number;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt?: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'datetime', nullable: true })
  deletedAt?: Date;

  @ManyToOne(() => UserEntity, (u) => u.admin_locations_by_me)
  @JoinColumn({ name: 'created_by' })
  creator: UserEntity;

  @OneToMany(() => DeviceEntity, (d) => d.admin_location)
  devices: DeviceEntity[];

  @OneToMany(() => EmployeeEntity, (e) => e.admin_location)
  employees: EmployeeEntity[];

  @OneToMany(() => UserEntity, (u) => u.admin_location)
  users: UserEntity[];
}
