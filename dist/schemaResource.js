"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var rxjs_1 = require("rxjs");
var uuid_1 = require("uuid");
var _1 = require("./");
var SchemaResource = (function (_super) {
    tslib_1.__extends(SchemaResource, _super);
    function SchemaResource(service, name, rawElements, spec) {
        var _this = _super.call(this, service) || this;
        _this.service = service;
        _this.name = name;
        _this.spec = spec;
        _this.elements = [];
        _this._change = new rxjs_1.BehaviorSubject(null);
        _this.elements = rawElements.map(function (data) {
            return new rxjs_1.BehaviorSubject({
                data: data,
                lastUpdate: Date.now(),
                propertiesChanged: []
            });
        });
        _this.change.next({
            action: "add",
            lastUpdate: Date.now()
        });
        return _this;
    }
    Object.defineProperty(SchemaResource.prototype, "elementSubscribable", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SchemaResource.prototype, "resourceSubscribable", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    SchemaResource.prototype.getElement = function (elementId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2, {
                        data: this.elements.find(function (element) {
                            return element.getValue().data.id === elementId;
                        }),
                        status: "ok"
                    }];
            });
        });
    };
    SchemaResource.prototype.getResource = function (offset, limit) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var data, o, l, el, el;
            return tslib_1.__generator(this, function (_a) {
                o = 0;
                l = this.elements.length;
                if (offset && typeof offset === "number") {
                    o = offset;
                }
                else if (offset && typeof offset === "string") {
                    el = this.elements.find(function (x) { return x.getValue().data.id === offset; });
                    if (el) {
                        o = this.elements.indexOf(el);
                    }
                }
                if (limit && typeof limit === "number") {
                    l = o + limit;
                }
                else if (limit && typeof limit === "string") {
                    el = this.elements.find(function (x) { return x.getValue().data.id === limit; });
                    if (el) {
                        l = this.elements.indexOf(el) + 1;
                    }
                }
                data = this.elements.slice(o, l);
                return [2, {
                        data: data,
                        status: "ok"
                    }];
            });
        });
    };
    SchemaResource.prototype.getResourceSpec = function () {
        return this.spec;
    };
    SchemaResource.prototype.updateElement = function (elementId, difference) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var elementResponse, element, collection, newData;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.getElement(elementId)];
                    case 1:
                        elementResponse = _a.sent();
                        element = elementResponse.data;
                        collection = element.getValue();
                        newData = Object.assign({}, collection.data, difference);
                        element.next({
                            data: newData,
                            lastUpdate: Date.now(),
                            propertiesChanged: []
                        });
                        this._change.next({
                            action: "update",
                            lastUpdate: Date.now(),
                            newValue: newData,
                            oldValue: collection.data
                        });
                        return [2, {
                                status: "ok"
                            }];
                }
            });
        });
    };
    SchemaResource.prototype.createElement = function (state) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var newElement;
            return tslib_1.__generator(this, function (_a) {
                if (!state.name) {
                    return [2, {
                            code: _1.StatusCode.INTERNAL_SERVER_ERROR,
                            error: new Error("providing a name is mandatory"),
                            status: "error"
                        }];
                }
                if (!state.id) {
                    state.id = uuid_1.v4();
                }
                state.uri = "/" + this.service.name.toLowerCase() + "/" + this.name.toLowerCase() + "/" + state.id;
                newElement = new rxjs_1.BehaviorSubject({
                    data: state,
                    lastUpdate: Date.now(),
                    propertiesChanged: []
                });
                this.elements.push(newElement);
                this._change.next({
                    action: "add",
                    lastUpdate: Date.now()
                });
                return [2, {
                        data: newElement,
                        status: "ok"
                    }];
            });
        });
    };
    SchemaResource.prototype.deleteElement = function (elementId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var idx;
            return tslib_1.__generator(this, function (_a) {
                idx = this.elements.findIndex(function (element) {
                    return element.getValue().data.id === elementId;
                });
                if (-1 !== idx) {
                    this.elements.splice(idx, 1);
                    this._change.next({
                        action: "remove",
                        lastUpdate: Date.now()
                    });
                    return [2, {
                            status: "ok"
                        }];
                }
                return [2, {
                        code: 404,
                        message: "Element can not be found",
                        status: "error"
                    }];
            });
        });
    };
    return SchemaResource;
}(_1.Resource));
exports.SchemaResource = SchemaResource;
//# sourceMappingURL=schemaResource.js.map