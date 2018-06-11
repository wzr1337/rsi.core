"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Service = (function () {
    function Service() {
        this.id = "no id set";
        this.resources = [];
        this.specification = "";
    }
    Service.getInstance = function () {
        return this.instance || (this.instance = new this());
    };
    Object.defineProperty(Service.prototype, "name", {
        get: function () {
            return this.constructor.name;
        },
        enumerable: true,
        configurable: true
    });
    Service.prototype.getResource = function (name) {
        return this.resources.find(function (r) { return r.name === name; });
    };
    Service.prototype.getSpecification = function () {
        return this.specification;
    };
    Service.prototype.setSpecification = function (spec) {
        this.specification = spec;
    };
    Service.prototype.addResource = function (resource) {
        this.resources.push(resource);
    };
    return Service;
}());
exports.Service = Service;
//# sourceMappingURL=service.js.map