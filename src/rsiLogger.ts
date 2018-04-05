import * as winston from "winston";

// tslint:disable-next-line:no-empty-interface
export interface IRsiLoggerInstance extends winston.LoggerInstance { }

const LOGFILE = "server.log";

export class RsiLogger {

  public static getInstance(): RsiLogger {
    return RsiLogger.instance;
  }

  private static instance: RsiLogger = new RsiLogger();

  public loggers: { [name: string]: IRsiLoggerInstance } = {};

  constructor() {
    if (RsiLogger.instance) {
      throw new Error("Error: Instantiation failed: Use SingletonClass.getInstance() instead of new.");
    }
    RsiLogger.instance = this;
  }
/**
 * get a logger
 *
 * @param {string} label the loggers name
 * @param {string} [level="error"] the log level, defaults to "error"
 * @returns {IRsiLoggerInstance} an instance of a logger
 * @memberof RsiLogger
 */
  // tslint:disable-next-line:max-line-length
  public getLogger(label: string, level: "error"|"warn"|"info"|"verbose"|"debug"|"silly" = "error"): IRsiLoggerInstance {
  if (!this.loggers.hasOwnProperty(label)) {
      this.loggers[label] = new (winston.Logger)({
        transports: [
          new (winston.transports.Console)({
            colorize: true,
            label,
            level,
            prettyPrint: true,
            timestamp: true
          }),
          new (winston.transports.File)({
            filename: LOGFILE,
            label,
            level,
            timestamp: true
          })
        ]
      });
    }
  return this.loggers[label];
  }

}
