import 'winston-daily-rotate-file';
export declare class Logger {
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
export declare const appLogger: Logger;
