import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'user_detail' })
export class UserDetailEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'bigint' })
  user_id: number;

  @Column({ nullable: true })
  surname: string;

  @Column({ nullable: true })
  given_name: string;

  @Column({ nullable: true })
  job_title: string;

  @Column({ nullable: true })
  office_phone: string;

  @Column({ nullable: true })
  mobile_number: string;

  @Column({ nullable: true })
  admin_desc: string;

  @Column({ nullable: true })
  account_no_desc: string;

  @Column({ nullable: true })
  paypoint_desc: string;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt?: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'datetime', nullable: true })
  deletedAt?: Date;

  @OneToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
