import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { GenericEntity } from './generic.entity';

export enum EmailVerifyType {
  email_verify = 'email_verify',
  reset_password = 'reset_password',
  forget_password = 'forget_password',
}

@Entity({ name: 'email_verify_code' })
export class EmailVerifyCodeEntity extends GenericEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({})
  email: string;

  @Column({ type: 'enum', enum: EmailVerifyType, default: EmailVerifyType.email_verify })
  type: string;

  @Column({ name: 'code' })
  code: number;

  @Column({ name: 'verify_token' })
  verifyToken: string;

  @Column({ name: 'expiry_date', type: 'datetime' })
  expiryDate: Date;
}
