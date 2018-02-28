"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Resource = /** @class */ (function () {
    function Resource() {
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