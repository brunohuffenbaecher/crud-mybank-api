import winston from 'winston';
import winstondb from 'winston-mongodb';

const { combine, timestamp, label, printf } = winston.format;
const { createLogger, transports, format } = winston;

const myFormat = format.printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const logger = createLogger({
  transports: [
    new transports.Console({ level: 'info' }),
    new transports.MongoDB({
      level: 'info',
      db: process.env.MONGO_CONNECTION,
      collection: 'logs_accounts',
      capped: true,
      cappedMax: 200,
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    }),
  ],
  format: combine(
    label({ label: 'CRUD-mybank-api' }),
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    myFormat
  ),
});

export { logger };
