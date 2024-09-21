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

@Entity({ name: 'employees' })
export class EmployeeEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ unique: true })
  employee_no: string;

  @Column({ type: 'bigint' })
  admin_location_id: number;

  @Column()
  name_report: string;

  @Column({ nullable: true })
  position_no: string;

  @Column({ nullable: true })
  occup_pos_title: string;

  @Column({ nullable: true })
  award: string;

  @Column({ nullable: true })
  award_desc: string;

  @Column({ nullable: true })
  classification: string;

  @Column({ nullable: true })
  class_desc: string;

  @Column({ nullable: true })
  step_no: string;

  @Column({ nullable: true })
  occup_type: string;

  @Column({ nullable: true })
  gender: string;

  @Column({ nullable: true, type: 'datetime' })
  first_commence: Date;

  @Column({ nullable: true })
  account_no: string;

  @Column({ nullable: true })
  account_no_desc: string;

  @Column({ nullable: true })
  emp_status: string;

  @Column({ nullable: true })
  paypoint: string;

  @Column({ nullable: true })
  paypoint_desc: string;

  @Column({ nullable: true, type: 'datetime' })
  date_of_birth: Date;

  @Column({ nullable: true })
  occup_pos_cat: string;

  @Column({ nullable: true })
  avatar_src: string;

  @Column({ nullable: true })
  archived_reason: string;

  @Column({ nullable: true })
  archived_comment: string;

  @Column({ nullable: true })
  archived_file: string;

  @Column({ nullable: true, type: 'datetime' })
  archived_at: Date;

  @Column({ type: 'bigint', nullable: true })
  archived_by?: number;

  @Column({ type: 'bigint' })
  created_by: number;

  @Column({ default: true })
  status: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt?: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'datetime', nullable: true })
  deletedAt?: Date;

  @ManyToOne(() => AdminLocationEntity, (a) => a.employees)
  @JoinColumn({ name: 'admin_location_id' })
  admin_location: AdminLocationEntity;

  @ManyToOne(() => UserEntity, (u) => u.employees_by_me)
  @JoinColumn({ name: 'created_by' })
  creator: UserEntity;

  @ManyToOne(() => UserEntity, (u) => u.employees_by_me)
  @JoinColumn({ name: 'archived_by' })
  archive_user?: UserEntity;

  @OneToMany(() => AttendanceEntity, (a) => a.employee)
  attendances: AttendanceEntity[];
}
