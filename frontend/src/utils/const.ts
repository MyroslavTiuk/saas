import { config } from 'dotenv';
import * as process from 'process';

config();

export const PORT = Number(process.env.PORT) || 8080;
export const LOG_LEVEL = Number(process.env.LOG_LEVEL) || 30;

export const FRONT_END_URL = process.env.FRONT_END_URL || '';

export const LOG_LEVEL_TYPEORM =
  LOG_LEVEL < 20 ? 'all' : ['schema', 'error', 'warn', 'info', 'log', 'migration'];

const DB_HOSTNAME = process.env.DB_HOSTNAME || '';
const DB_PORT = Number(process.env.DB_PORT) || 3306;
const DB_DATABASE = process.env.DB_DATABASE || '';
const DB_USERNAME = process.env.DB_USERNAME || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';

export const DATABASE_CONFIG = {
  type: 'mysql',
  host: DB_HOSTNAME,
  port: DB_PORT,
  database: DB_DATABASE,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  timezone: 'Z',
};

export const JWT_SECRET = process.env.JWT_SECRET || '';
console.log('HOST: ', DATABASE_CONFIG.host);

export const MAIL_HOST = process.env.MAIL_HOST || '';
export const MAIL_PORT = process.env.MAIL_PORT || 2525;
export const MAIL_USERNAME = process.env.MAIL_USERNAME || '';
export const MAIL_PASSWORD = process.env.MAIL_PASSWORD || '';
export const MAIL_FROM_ADDRESS = process.env.MAIL_FROM_ADDRESS || '';
console.log('MAIL HOST: ', MAIL_HOST);

export const LIMIT_AT_ONCE = 100;

export enum ACCESS_PRIVILEGE {
  SUPER_USER = 'Super User',
  NON_TEACHER_USER = 'Non-Teacher User',
  TEACHER_USER = 'Teacher User',
  BUREAUCRAT_USER = 'Bureaucrat User',
}

export enum USER_TYPE {
  TEACHER = 'Teacher',
  NON_TEACHER = 'Non-Teacher',
}

export enum ADMIN_LOCATION_LEVEL_USER {
  ADMIN_LOCATION_USER = 'Admin Location User',
  ACCOUNT_NO_DESC_USER = 'Account No Desc User',
  PAYPOINT_DESC_USER = 'Paypoint Desc User',
}

export enum GENDER {
  MALE = 'M',
  FEMALE = 'F',
}
