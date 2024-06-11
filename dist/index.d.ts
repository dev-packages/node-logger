import 'winston-daily-rotate-file';
export type LogLevel = 'silly' | 'debug' | 'verbose' | 'http' | 'info' | 'warn' | 'error';
export declare class StaticLogger {
    private readonly label;
    private static base;
    constructor(label: string);
    error(...args: any[]): void;
    warn(...args: any[]): void;
    info(...args: any[]): void;
    http(...args: any[]): void;
    verbose(...args: any[]): void;
    debug(...args: any[]): void;
    silly(...args: any[]): void;
}
export declare const appLogger: StaticLogger;
