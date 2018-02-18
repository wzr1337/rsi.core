"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var StatusCode;
(function (StatusCode) {
    StatusCode[StatusCode["OK"] = 200] = "OK";
    StatusCode[StatusCode["CREATED"] = 201] = "CREATED";
    StatusCode[StatusCode["ACCEPTED"] = 202] = "ACCEPTED";
    StatusCode[StatusCode["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    StatusCode[StatusCode["FORBIDDEN"] = 403] = "FORBIDDEN";
    StatusCode[StatusCode["NOT_FOUND"] = 404] = "NOT_FOUND";
    StatusCode[StatusCode["INTERNAL_SERVER_ERROR"] = 500] = "INTERNAL_SERVER_ERROR";
    StatusCode[StatusCode["NOT_IMPLEMENTED"] = 501] = "NOT_IMPLEMENTED";
    StatusCode[StatusCode["SERVICE_UNAVAILABLE"] = 503] = "SERVICE_UNAVAILABLE";
})(StatusCode = exports.StatusCode || (exports.StatusCode = {}));
var Response = /** @class */ (function () {
    function Response() {
    }
    return Response;
}());
exports.Response = Response;
var ElementResponse = /** @class */ (function (_super) {
    __extends(ElementResponse, _super);
    function ElementResponse() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ElementResponse;
}(Response));
exports.ElementResponse = ElementResponse;
var CollectionResponse = /** @class */ (function (_super) {
    __extends(CollectionResponse, _super);
    function CollectionResponse() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CollectionResponse;
}(Response));
exports.CollectionResponse = CollectionResponse;
/**
 * The general service class
 *
 * @export
 * @class Service
 */
var Service = /** @class */ (function () {
    function Service() {
        this._resources = [];
        this._id = "no id set";
        this._specification = "";
    }
    Object.defineProperty(Service.prototype, "name", {
        /**
         * Retrieve the service name in all-lower-case
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
    Object.defineProperty(Service.prototype, "id", {
        /**
         * Retrive the services id
         *
         * @type {string}
         * @memberof Service
         */
        get: function () {
            return this._id;
        },
        /**
         * Setter for service id
         *
         * @param id {string} set the id
         * @memberof Service
         */
        set: function (id) {
            this._id = id;
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
            return this._resources;
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
        return this._resources.find(function (r) { return r.name === name; });
    };
    Service.prototype.getSpecification = function () {
        return this._specification;
    };
    Service.prototype.setSpecification = function (spec) {
        this._specification = spec;
    };
    return Service;
}());
exports.Service = Service;
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
//# sourceMappingURL=rsiPlugin.js.map