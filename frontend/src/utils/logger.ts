import { NestjsWinstonLoggerService } from 'nestjs-winston-logger';
import { format, transports } from 'winston';

export const logger = new NestjsWinstonLoggerService({
  format: format.combine(format.simple(), format.colorize({ all: true })),
  transports: [new transports.Console({ level: 'debug' })],
});
