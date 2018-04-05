"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var winston = require("winston");
var LOGFILE = "server.log";
var RsiLogger = /** @class */ (function () {
    function RsiLogger() {
        this.loggers = {};
        if (RsiLogger.instance) {
            throw new Error("Error: Instantiation failed: Use SingletonClass.getInstance() instead of new.");
        }
        RsiLogger.instance = this;
    }
    RsiLogger.getInstance = function () {
        return RsiLogger.instance;
    };
    /**
     * get a logger
     *
     * @param {string} label the loggers name
     * @param {string} [level="error"] the log level, defaults to "error"
     * @returns {IRsiLoggerInstance} an instance of a logger
     * @memberof RsiLogger
     */
    // tslint:disable-next-line:max-line-length
    RsiLogger.prototype.getLogger = function (label, level) {
        if (level === void 0) { level = "error"; }
        if (!this.loggers.hasOwnProperty(label)) {
            this.loggers[label] = new (winston.Logger)({
                transports: [
                    new (winston.transports.Console)({
                        colorize: true,
                        label: label,
                        level: level,
                        prettyPrint: true,
                        timestamp: true
                    }),
                    new (winston.transports.File)({
                        filename: LOGFILE,
                        label: label,
                        level: level,
                        timestamp: true
                    })
                ]
            });
        }
        return this.loggers[label];
    };
    RsiLogger.instance = new RsiLogger();
    return RsiLogger;
}());
exports.RsiLogger = RsiLogger;
//# sourceMappingURL=rsiLogger.js.map