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
    /**
     * get a logger
     *
     * @param {string} label the loggers name
     * @param {string} [level="error"] the log level, defaults to "error"
     * @returns {IRsiLoggerInstance} an instance of a logger
     * @memberof RsiLogger
     */
    getLogger(label: string, level?: "error" | "warn" | "info" | "verbose" | "debug" | "silly"): IRsiLoggerInstance;
}
