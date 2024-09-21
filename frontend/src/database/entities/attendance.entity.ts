import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
  Index,
} from 'typeorm';
import { EmployeeEntity } from './employee.entity';
import { DeviceEntity } from './device.entity';

@Entity({ name: 'attendances' })
@Index(['employee_id', 'date'], { unique: true })
export class AttendanceEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'bigint' })
  employee_id: number;

  @Column({ type: 'bigint' })
  clock_in_device_id: number;

  @Column({ type: 'bigint', nullable: true })
  clock_out_device_id: number;

  @Column({ nullable: true })
  clocked_in: string;

  @Column({ nullable: true })
  clocked_out: string;

  @Column({ nullable: true })
  worked_hours: string;

  @Column({ nullable: true })
  date: string;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt?: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'datetime', nullable: true })
  deletedAt?: Date;

  @ManyToOne(() => EmployeeEntity, (e) => e.attendances)
  @JoinColumn({ name: 'employee_id' })
  employee: EmployeeEntity;

  @ManyToOne(() => DeviceEntity, (d) => d.attendances)
  @JoinColumn({ name: 'clock_in_device_id' })
  clockInDevice: DeviceEntity;

  @ManyToOne(() => DeviceEntity, (d) => d.clockOutAttendances)
  @JoinColumn({ name: 'clock_out_device_id' })
  clockOutDevice: DeviceEntity;
}
