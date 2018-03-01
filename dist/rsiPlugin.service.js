"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The general service class
 *
 * @export
 * @class Service
 */
var Service = /** @class */ (function () {
    function Service() {
        this.id = "no id set";
        this.knownResources = [];
        this.specification = "";
    }
    Object.defineProperty(Service.prototype, "name", {
        /**
         * Retrieve the service name including casing
         *
         * @readonly
         * @type {string}
         * @memberof Service
         */
        get: function () {
            return this.constructor.name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Service.prototype, "resources", {
        /**
         * Get a list of resources providesd by the service
         *
         * @readonly
         * @type {Resource[]} the rescoures provided by the service
         * @memberof Service
         */
        get: function () {
            return this.knownResources;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Get a dedicates of resource by name
     *
     * @param {string} name the resource name
     * @returns {Resource}
     * @memberof Service
     */
    Service.prototype.getResource = function (name) {
        return this.resources.find(function (r) { return r.name === name; });
    };
    Service.prototype.getSpecification = function () {
        return this.specification;
    };
    Service.prototype.setSpecification = function (spec) {
        this.specification = spec;
    };
    return Service;
}());
exports.Service = Service;
//# sourceMappingURL=rsiPlugin.service.js.map