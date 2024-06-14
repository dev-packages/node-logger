"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appLogger = exports.StaticLogger = void 0;
const winston_1 = __importStar(require("winston"));
const util = __importStar(require("node:util"));
require("winston-daily-rotate-file");
const LABEL = Symbol('label');
const utilFormatter = () => {
    return {
        transform: (info, opts) => {
            const args = info[Symbol.for('splat')];
            if (!args) {
                return info;
            }
            // const labelOption = args.find((arg) => arg[LABEL] !== undefined);
            // Поскольку он всегда отправляется последним, то можно просто взять последний элемент
            const labelOption = args[args.length - 1][LABEL] ? args[args.length - 1] : undefined;
            if (labelOption) {
                info[LABEL] = labelOption[LABEL];
                info.message = `[${labelOption[LABEL]}]: ${util.format(info.message, ...args.filter((arg) => arg !== labelOption))}`;
            }
            else {
                info.message = util.format(info.message, ...args);
            }
            return info;
        }
    };
};
const consoleFormatter = winston_1.format.combine(winston_1.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }), utilFormatter(), winston_1.format.colorize(), winston_1.format.printf(({ timestamp, level, message }) => `[${timestamp}] [${level}] ${message}`));
const fileFormatter = winston_1.format.combine(winston_1.format.timestamp({
    format: () => new Date().toISOString()
}), utilFormatter(), winston_1.format.json());
class StaticLogger {
    label;
    static base = winston_1.default.createLogger({
        transports: [
            new winston_1.default.transports.Console({
                level: 'silly',
                format: consoleFormatter,
            }),
            new winston_1.default.transports.DailyRotateFile({
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
            new winston_1.default.transports.DailyRotateFile({
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
        // exceptionHandlers: [
        //   new winston.transports.Console({
        //     level: 'error',
        //     format: consoleFormatter,
        //   }),
        //   new winston.transports.DailyRotateFile({
        //     level: 'error',
        //     dirname: 'logs',
        //     filename: 'exception-%DATE%',
        //     frequency: '1d',
        //     datePattern: 'YYYY-MM-DD',
        //     maxSize: '10m',
        //     zippedArchive: true,
        //     utc: true,
        //     extension: '.log',
        //     format: fileFormatter,
        //   }),
        // ]
    });
    constructor(label) {
        this.label = label;
    }
    error(...args) {
        // @ts-ignore
        StaticLogger.base.error(...args, { [LABEL]: this.label });
    }
    warn(...args) {
        // @ts-ignore
        StaticLogger.base.warn(...args, { [LABEL]: this.label });
    }
    info(...args) {
        // @ts-ignore
        StaticLogger.base.info(...args, { [LABEL]: this.label });
    }
    http(...args) {
        // @ts-ignore
        StaticLogger.base.http(...args, { [LABEL]: this.label });
    }
    verbose(...args) {
        // @ts-ignore
        StaticLogger.base.verbose(...args, { [LABEL]: this.label });
    }
    debug(...args) {
        // @ts-ignore
        StaticLogger.base.debug(...args, { [LABEL]: this.label });
    }
    silly(...args) {
        // @ts-ignore
        StaticLogger.base.silly(...args, { [LABEL]: this.label });
    }
}
exports.StaticLogger = StaticLogger;
exports.appLogger = new StaticLogger('APP');
//# sourceMappingURL=index.js.map