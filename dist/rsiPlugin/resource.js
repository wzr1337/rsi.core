"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var rxjs_1 = require("rxjs");
var Resource = (function () {
    function Resource(service) {
        this.service = service;
        this.elements = [];
        this._change = new rxjs_1.BehaviorSubject({ lastUpdate: Date.now(), action: "init" });
    }
    Object.defineProperty(Resource.prototype, "name", {
        get: function () {
            return this.constructor.name;
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
    Resource.prototype.getResource = function (offset, limit) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var resp;
            return tslib_1.__generator(this, function (_a) {
                if ((typeof offset === "number" && typeof limit === "number") ||
                    (typeof limit === "number" && !offset) ||
                    (typeof offset === "number" && !limit) ||
                    (!offset && !limit)) {
                    resp = this.elements.slice(offset, limit);
                }
                return [2, { status: "ok", data: resp }];
            });
        });
    };
    Resource.prototype.getElement = function (elementId) {
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
    Resource.prototype.removeElement = function (elementId) {
        var origLen = this.elements.length;
        this.elements = this.elements.filter(function (element) {
            return element.getValue().data.id !== elementId;
        });
        if (this.elements.length < origLen) {
            this._change.next({ lastUpdate: Date.now(), action: "remove" });
            return true;
        }
        else {
            return false;
        }
    };
    Resource.prototype.addElement = function (element) {
        this.elements.push(element);
        this._change.next({ lastUpdate: Date.now(), action: "add" });
    };
    return Resource;
}());
exports.Resource = Resource;
//# sourceMappingURL=resource.js.map