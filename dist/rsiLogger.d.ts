import * as winston from "winston";
export interface IRsiLoggerInstance extends winston.LoggerInstance {
}
export declare class RsiLogger {
    static getInstance(): RsiLogger;
    private static instance;
    loggers: {
        [name: string]: IRsiLoggerInstance;
    };
    constructor();
    getLogger(label: string, level?: "error" | "warn" | "info" | "verbose" | "debug" | "silly"): IRsiLoggerInstance;
}
