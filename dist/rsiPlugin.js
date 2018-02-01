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
var Service = /** @class */ (function () {
    function Service() {
        this._resources = [];
    }
    Object.defineProperty(Service.prototype, "name", {
        get: function () {
            return this.constructor.name.toLowerCase();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Service.prototype, "id", {
        get: function () {
            return this._id;
        },
        set: function (id) {
            this._id = id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Service.prototype, "resources", {
        get: function () {
            return this._resources;
        },
        enumerable: true,
        configurable: true
    });
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
//# sourceMappingURL=rsiPlugin.js.map