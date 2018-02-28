/* tslint:disable:no-empty-interface */
import * as winston from "winston";
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

  public getLogger(name: string): IRsiLoggerInstance {
    if (!this.loggers.hasOwnProperty(name)) {
      this.loggers[name] = new (winston.Logger)({
        transports: [
          new (winston.transports.Console)({
            colorize: true,
            label: name,
            level: "error",
            prettyPrint: true,
            timestamp: true
          }),
          new (winston.transports.File)({
            filename: LOGFILE,
            label: name,
            level: "error",
            timestamp: true
          })
        ]
      });
    }
    return this.loggers[name];
  }
}
