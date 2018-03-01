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
    RsiLogger.prototype.getLogger = function (name) {
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
    };
    RsiLogger.instance = new RsiLogger();
    return RsiLogger;
}());
exports.RsiLogger = RsiLogger;
//# sourceMappingURL=rsiLogger.js.map