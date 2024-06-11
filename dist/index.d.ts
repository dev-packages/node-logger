import 'winston-daily-rotate-file';
export type LogLevel = 'silly' | 'debug' | 'verbose' | 'http' | 'info' | 'warn' | 'error';
export declare class StaticLogger {
    private readonly label;
    private static base;
    constructor(label: string);
    static error(...args: any[]): void;
    static warn(...args: any[]): void;
    static info(...args: any[]): void;
    static http(...args: any[]): void;
    static verbose(...args: any[]): void;
    static debug(...args: any[]): void;
    static silly(...args: any[]): void;
}
export declare const appLogger: StaticLogger;
