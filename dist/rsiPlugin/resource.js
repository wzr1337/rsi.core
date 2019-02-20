"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var rxjs_1 = require("rxjs");
var Resource = (function () {
    function Resource(service) {
        this.service = service;
        this.elements = {};
        this.keyOrder = [];
        this._change = new rxjs_1.BehaviorSubject({ lastUpdate: Date.now(), action: "init" });
    }
    Resource.prototype.removeFromArray = function (arr) {
        var what = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            what[_i - 1] = arguments[_i];
        }
        var $what, a = what, L = a.length, ax;
        while (L > 1 && arr.length) {
            $what = a[--L];
            while ((ax = arr.indexOf($what)) !== -1) {
                arr.splice(ax, 1);
            }
        }
        return arr;
    };
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
    Object.defineProperty(Resource.prototype, "numberOfElements", {
        get: function () {
            return Object.keys(this.elements).length;
        },
        enumerable: true,
        configurable: true
    });
    Resource.prototype.getResource = function (offset, limit) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var resp, _i, _a, key;
            return tslib_1.__generator(this, function (_b) {
                resp = [];
                if ((typeof offset === "number" && typeof limit === "number") ||
                    (typeof limit === "number" && !offset) ||
                    (typeof offset === "number" && !limit) ||
                    (!offset && !limit)) {
                    for (_i = 0, _a = this.keyOrder.slice(offset, limit); _i < _a.length; _i++) {
                        key = _a[_i];
                        resp.push(this.elements[key]);
                    }
                }
                return [2, { status: "ok", data: resp }];
            });
        });
    };
    Resource.prototype.getElement = function (elementId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2, {
                        data: this.elements[elementId],
                        status: "ok"
                    }];
            });
        });
    };
    Resource.prototype.removeElement = function (elementId) {
        var origLen = this.keyOrder.length;
        this.keyOrder = this.removeFromArray(this.keyOrder, elementId);
        delete this.elements[elementId];
        if (this.keyOrder.length < origLen) {
            this._change.next({ lastUpdate: Date.now(), action: "remove" });
            return true;
        }
        else {
            return false;
        }
    };
    Resource.prototype.addElement = function (element) {
        var id = element.getValue().data.id;
        this.elements[id] = element;
        this.keyOrder.push(id);
        this._change.next({ lastUpdate: Date.now(), action: "add" });
    };
    Resource.prototype.getElementById = function (elementId) {
        return this.elements[elementId];
    };
    Resource.prototype.updateElementById = function (elementId, difference, propertiesChanged) {
        var subject = this.getElementById(elementId);
        if (!subject) {
            return false;
        }
        var element = {
            data: tslib_1.__assign({}, subject.getValue().data, difference),
            lastUpdate: Date.now(),
            propertiesChanged: propertiesChanged
        };
        subject.next(element);
        return true;
    };
    return Resource;
}());
exports.Resource = Resource;
//# sourceMappingURL=resource.js.map