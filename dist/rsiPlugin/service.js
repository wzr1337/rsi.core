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
        this.resources = [];
        this.specification = "";
    }
    Service.getInstance = function () {
        return this.instance || (this.instance = new this());
    };
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
    /**
     * Add a resource to the list of known resources
     *
     * @param {Resource} resource the resource itself
     * @memberof Service
     */
    Service.prototype.addResource = function (resource) {
        this.resources.push(resource);
    };
    return Service;
}());
exports.Service = Service;
//# sourceMappingURL=service.js.map