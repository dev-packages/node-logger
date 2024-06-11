import winston, { format } from 'winston';
import * as util from 'node:util';
import 'winston-daily-rotate-file';

const LABEL = Symbol('label');

const utilFormatter = () => {
  return {
    transform: (info: any, opts: any) => {
      const args: any[] | undefined = info[Symbol.for('splat')];

      if (!args) {
        return info;
      }

      // const labelOption = args.find((arg) => arg[LABEL] !== undefined);
      // Поскольку он всегда отправляется последним, то можно просто взять последний элемент
      const labelOption = args[args.length - 1][LABEL] ? args[args.length - 1] : undefined;
      if (labelOption) {
        info[LABEL] = labelOption[LABEL];
        info.message = `[${labelOption[LABEL]}]: ${util.format(info.message, ...args.filter((arg) => arg !== labelOption))}`;
      } else {
        info.message = util.format(info.message, ...args);
      }

      return info;
    }
  };
}

const consoleFormatter = format.combine(
  format.timestamp({format: 'YYYY-MM-DD HH:mm:ss.SSS'}),
  utilFormatter(),
  format.colorize(),
  format.printf(({ timestamp, level, message }) => `[${timestamp}] [${level}] ${message}`),
);

const fileFormatter = format.combine(
  format.timestamp({
    format: () => new Date().toISOString()
  }),
  utilFormatter(),
  format.json(),
);

export type LogLevel = 'silly' | 'debug' | 'verbose' | 'http' | 'info' | 'warn' | 'error';

export class StaticLogger {

  private static base = winston.createLogger({
    transports: [
      new winston.transports.Console({
        level: 'silly',
        format: consoleFormatter,
      }),
      new winston.transports.DailyRotateFile({
        dirname: 'logs',
        filename: 'combined-%DATE%',
        frequency: '1h',
        datePattern: 'YYYY-MM-DD-HH',
        maxSize: '10m',
        zippedArchive: true,
        utc: true,
        extension: '.log',
        format: fileFormatter,
      }),
      new winston.transports.DailyRotateFile({
        level: 'error',
        dirname: 'logs',
        filename: 'error-%DATE%',
        frequency: '1h',
        datePattern: 'YYYY-MM-DD-HH',
        maxSize: '10m',
        zippedArchive: true,
        utc: true,
        extension: '.log',
        format: fileFormatter,
      }),
    ],
    exceptionHandlers: [
      new winston.transports.DailyRotateFile({
        level: 'error',
        dirname: 'logs',
        filename: 'exception-%DATE%',
        frequency: '1d',
        datePattern: 'YYYY-MM-DD',
        maxSize: '10m',
        zippedArchive: true,
        utc: true,
        extension: '.log',
        format: fileFormatter,
      }),
    ]
  });

  constructor(private readonly label: string) {}

  public static error(...args: any[]): void {
    // @ts-ignore
    this.base.error(...args, { [LABEL]: this.label });
  }

  public static warn(...args: any[]): void {
    // @ts-ignore
    this.base.warn(...args, { [LABEL]: this.label });
  }

  public static info(...args: any[]): void {
    // @ts-ignore
    this.base.info(...args, { [LABEL]: this.label });
  }

  public static http(...args: any[]): void {
    // @ts-ignore
    this.base.http(...args, { [LABEL]: this.label });
  }

  public static verbose(...args: any[]): void {
    // @ts-ignore
    this.base.verbose(...args, { [LABEL]: this.label });
  }

  public static debug(...args: any[]): void {
    // @ts-ignore
    this.base.debug(...args, { [LABEL]: this.label });
  }

  public static silly(...args: any[]): void {
    // @ts-ignore
    this.base.silly(...args, { [LABEL]: this.label });
  }

}

export const appLogger = new StaticLogger('APP');
