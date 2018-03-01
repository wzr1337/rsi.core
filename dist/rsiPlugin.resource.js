"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var Resource = /** @class */ (function () {
    function Resource(service) {
        this.service = service;
        this._change = new rxjs_1.BehaviorSubject({ lastUpdate: Date.now(), action: "init" });
    }
    Object.defineProperty(Resource.prototype, "name", {
        /**
         * Retrieve the resource name in all-lower-case
         *
         * @readonly
         * @type {string}
         * @memberof Service
         */
        get: function () {
            return this.constructor.name.toLowerCase();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Resource.prototype, "change", {
        get: function () {
            return this._change;
        },
        enumerable: true,
        configurable: true
    });
    return Resource;
}());
exports.Resource = Resource;
//# sourceMappingURL=rsiPlugin.resource.js.map