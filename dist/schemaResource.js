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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var uuid_1 = require("uuid");
var _1 = require("./");
var SchemaResource = /** @class */ (function (_super) {
    __extends(SchemaResource, _super);
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
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, {
                        data: this.elements.find(function (element) {
                            return element.getValue().data.id === elementId;
                        }),
                        status: "ok"
                    }];
            });
        });
    };
    SchemaResource.prototype.getResource = function (offset, limit) {
        return __awaiter(this, void 0, void 0, function () {
            var data, o, l, el, el;
            return __generator(this, function (_a) {
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
                return [2 /*return*/, {
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
        return __awaiter(this, void 0, void 0, function () {
            var elementResponse, element, collection, newData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getElement(elementId)];
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
                        return [2 /*return*/, {
                                status: "ok"
                            }];
                }
            });
        });
    };
    SchemaResource.prototype.createElement = function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var newElement;
            return __generator(this, function (_a) {
                if (!state.name) {
                    return [2 /*return*/, {
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
                return [2 /*return*/, {
                        data: newElement,
                        status: "ok"
                    }];
            });
        });
    };
    SchemaResource.prototype.deleteElement = function (elementId) {
        return __awaiter(this, void 0, void 0, function () {
            var idx;
            return __generator(this, function (_a) {
                idx = this.elements.findIndex(function (element, index) {
                    return element.getValue().data.id === elementId;
                });
                if (-1 !== idx) {
                    this.elements.splice(idx, 1); // remove one item from the collections array
                    this._change.next({
                        action: "remove",
                        lastUpdate: Date.now()
                    });
                    return [2 /*return*/, {
                            status: "ok"
                        }];
                }
                return [2 /*return*/, {
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