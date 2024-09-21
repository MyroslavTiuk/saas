import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'payloads' })
export class PayloadEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'bigint' })
  pay_no: number;

  @Column({ type: 'datetime' })
  start_at: Date;

  @Column({ type: 'datetime' })
  end_at: Date;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt?: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'datetime', nullable: true })
  deletedAt?: Date;
}
