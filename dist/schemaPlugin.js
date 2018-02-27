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
var fs = require("fs");
var fs_1 = require("fs");
var path = require("path");
var path_1 = require("path");
var rxjs_1 = require("rxjs");
var uuid = require("uuid");
var rsiPlugin_1 = require("./rsiPlugin");
var SchemaPlugin = /** @class */ (function (_super) {
    __extends(SchemaPlugin, _super);
    function SchemaPlugin() {
        var _this = _super.call(this) || this;
        _this.elements = [];
        _this.elementKeyMap = {};
        _this.model = {};
        _this.schema = {};
        _this.data = {};
        _this.resourceMap = {};
        return _this;
    }
    SchemaPlugin.prototype.init = function () {
        this.readData();
        this.readSchema();
        this.onReady();
    };
    SchemaPlugin.prototype.onReady = function () {
    };
    SchemaPlugin.prototype.readData = function () {
        if (fs_1.existsSync(path_1.join(this.pluginDir, "data.json"))) {
            var dataPath = path_1.join(this.pluginDir, "data.json");
            var d = fs.readFileSync(dataPath, "utf-8");
            try {
                this.data = JSON.parse(d);
            }
            catch (e) {
                console.log("Error parsing data for schema plugin ", this.name);
            }
        }
        else {
            console.log("DATA NOT FOUND ", path_1.join(this.pluginDir, "data.json"));
        }
    };
    SchemaPlugin.prototype.readSchema = function () {
        var _this = this;
        var schemaPath = path_1.join(this.pluginDir, "schema.json");
        if (fs_1.existsSync(schemaPath)) {
            var d = fs_1.readFileSync(schemaPath, "utf-8");
            try {
                var content = JSON.parse(d);
                this.setSpecification(content);
                var _loop_1 = function (resourceDef) {
                    var data = this_1.data[resourceDef] || [];
                    if (Array.isArray(this_1.data[resourceDef])) {
                        this_1.data[resourceDef].forEach(function (x) {
                            _this.elementKeyMap[x.id] = {
                                resource: resourceDef,
                                element: x,
                            };
                        });
                    }
                };
                var this_1 = this;
                for (var resourceDef in content.resources) {
                    _loop_1(resourceDef);
                }
                var _loop_2 = function (resourceDef) {
                    var data = this_2.data[resourceDef] || [];
                    this_2.updateUris(data);
                    var resource = new SchemaResource(this_2, resourceDef, data, content.resources[resourceDef]);
                    this_2.resourceMap[resourceDef] = resource;
                    resource.change.subscribe(function () { return __awaiter(_this, void 0, void 0, function () {
                        var collectionResponse, rawData, srcPath;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, resource.getResource()];
                                case 1:
                                    collectionResponse = _a.sent();
                                    rawData = collectionResponse.data.map(function (value) {
                                        return value.getValue().data;
                                    });
                                    this.data[resource.name] = rawData;
                                    srcPath = path.join(this.pluginDir, "data.json");
                                    srcPath = srcPath.replace("bin", "src");
                                    try {
                                        fs.writeFileSync(srcPath, JSON.stringify(this.data, null, 4), { encoding: "utf-8" }); // persist data also to src path otherwise it will be lost with each rebuild
                                    }
                                    catch (d) {
                                        console.log("Error writing data file src ", d);
                                    }
                                    try {
                                        fs.writeFileSync(path.join(__dirname, this.name, "data.json"), JSON.stringify(this.data, null, 4), { encoding: "utf-8" });
                                    }
                                    catch (e) {
                                        //console.log("Error writing data file bin");
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    this_2.resources.push(resource);
                };
                var this_2 = this;
                for (var resourceDef in content.resources) {
                    _loop_2(resourceDef);
                }
            }
            catch (e) {
                console.log("Error Reading schema for schema plugin ", schemaPath);
                console.log(e);
            }
        }
        else {
            console.log("Schema not found ", path_1.join(this.pluginDir, "schema.json"));
        }
    };
    SchemaPlugin.prototype.updateUris = function (data) {
        var clone = data;
        /* TODO: Set absolute uris
         if (data && data.hasOwnProperty('id') && this.elementKeyMap[data.id]) {
         data.uri = 'http://localhost:3000/' + this.name + '/' + this.elementKeyMap[data.id].resource + '/' + data.id;
         }
         */
        for (var i in clone) {
            if (typeof clone[i] === "object") {
                if (clone[i] && clone[i].hasOwnProperty("id")) {
                    this.updateUris(clone[i]);
                }
                else if (Array.isArray(clone[i])) {
                    for (var y = 0; y < clone[i].length; y++) {
                        if (clone[i][y].hasOwnProperty("id")) {
                            this.updateUris(clone[i][y]);
                        }
                    }
                }
            }
        }
    };
    return SchemaPlugin;
}(rsiPlugin_1.Service));
exports.SchemaPlugin = SchemaPlugin;
var SchemaResource = /** @class */ (function (_super) {
    __extends(SchemaResource, _super);
    function SchemaResource(service, name, rawElements, spec) {
        var _this = _super.call(this) || this;
        _this.service = service;
        _this.name = name;
        _this.spec = spec;
        _this._elements = [];
        _this._change = new rxjs_1.BehaviorSubject(null);
        _this._elements = rawElements.map(function (x) {
            return new rxjs_1.BehaviorSubject({
                lastUpdate: Date.now(),
                propertiesChanged: [],
                data: x,
            });
        });
        _this._change.next({ lastUpdate: Date.now(), action: "add" });
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
                        status: "ok",
                        data: this._elements.find(function (element) {
                            return element.getValue().data.id === elementId;
                        }),
                    }];
            });
        });
    };
    SchemaResource.prototype.getResource = function (offset, limit) {
        return __awaiter(this, void 0, void 0, function () {
            var resp, o, l, el, el;
            return __generator(this, function (_a) {
                o = 0;
                l = this._elements.length;
                if (offset && typeof offset === "number") {
                    o = offset;
                }
                else if (offset && typeof offset === "string") {
                    el = this._elements.find(function (x) { return x.getValue().data.id === offset; });
                    if (el) {
                        o = this._elements.indexOf(el);
                    }
                }
                if (limit && typeof limit === "number") {
                    l = o + limit;
                }
                else if (limit && typeof limit === "string") {
                    el = this._elements.find(function (x) { return x.getValue().data.id === limit; });
                    if (el) {
                        l = this._elements.indexOf(el) + 1;
                    }
                }
                resp = this._elements.slice(o, l);
                return [2 /*return*/, { status: "ok", data: resp }];
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
                            lastUpdate: Date.now(),
                            propertiesChanged: [],
                            data: newData,
                        });
                        this._change.next({ lastUpdate: Date.now(), action: "update", oldValue: collection.data, newValue: newData });
                        return [2 /*return*/, { status: "ok" }];
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
                            status: "error",
                            error: new Error("providing a name is mandatory"),
                            code: rsiPlugin_1.StatusCode.INTERNAL_SERVER_ERROR,
                        }];
                }
                if (!state.id) {
                    state.id = uuid.v1();
                }
                state.uri = "/" + this.service.name.toLowerCase() + "/" + this.name.toLowerCase() + "/" + state.id;
                newElement = new rxjs_1.BehaviorSubject({
                    lastUpdate: Date.now(),
                    propertiesChanged: [],
                    data: state,
                });
                this._elements.push(newElement);
                this._change.next({ lastUpdate: Date.now(), action: "add" });
                return [2 /*return*/, { status: "ok", data: newElement }];
            });
        });
    };
    SchemaResource.prototype.deleteElement = function (elementId) {
        return __awaiter(this, void 0, void 0, function () {
            var idx;
            return __generator(this, function (_a) {
                idx = this._elements.findIndex(function (element, index) {
                    return element.getValue().data.id === elementId;
                });
                if (-1 !== idx) {
                    this._elements.splice(idx, 1); //remove one item from the collections array
                    this._change.next({ lastUpdate: Date.now(), action: "remove" });
                    return [2 /*return*/, { status: "ok" }];
                }
                return [2 /*return*/, { status: "error", code: 404, message: "Element can not be found" }];
            });
        });
    };
    return SchemaResource;
}(rsiPlugin_1.Resource));
//# sourceMappingURL=schemaPlugin.js.map