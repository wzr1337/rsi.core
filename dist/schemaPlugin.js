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
var fs_1 = require("fs");
var path_1 = require("path");
var _1 = require("./");
var SchemaPlugin = /** @class */ (function (_super) {
    __extends(SchemaPlugin, _super);
    function SchemaPlugin() {
        var _this = _super.call(this) || this;
        _this.Elements = [];
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
    // tslint:disable-next-line:no-empty
    SchemaPlugin.prototype.onReady = function () {
    };
    SchemaPlugin.prototype.readData = function () {
        var dataPath = path_1.join(this.pluginDir, "data.json");
        if (fs_1.existsSync(dataPath)) {
            var d = fs_1.readFileSync(dataPath, "utf-8");
            try {
                this.data = JSON.parse(d);
            }
            catch (e) {
                console.log("Error parsing data for schema plugin ", this.name);
            }
        }
        else {
            console.log("DATA NOT FOUND ", dataPath);
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
                    if (content.resources.hasOwnProperty(resourceDef)) {
                        var data = this_1.data[resourceDef] || [];
                        if (Array.isArray(this_1.data[resourceDef])) {
                            this_1.data[resourceDef].forEach(function (x) {
                                _this.elementKeyMap[x.id] = {
                                    element: x,
                                    resource: resourceDef
                                };
                            });
                        }
                    }
                };
                var this_1 = this;
                for (var resourceDef in content.resources) {
                    _loop_1(resourceDef);
                }
                var _loop_2 = function (resourceDef) {
                    if (content.resources.hasOwnProperty(resourceDef)) {
                        var data = this_2.data[resourceDef] || [];
                        this_2.updateUris(data);
                        // tslint:disable-next-line:max-line-length
                        var resource_1 = new _1.SchemaResource(this_2, resourceDef, data, content.resources[resourceDef]);
                        this_2.resourceMap[resourceDef] = resource_1;
                        resource_1.change.subscribe(function () { return __awaiter(_this, void 0, void 0, function () {
                            var collectionResponse, rawData, srcPath;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, resource_1.getResource()];
                                    case 1:
                                        collectionResponse = _a.sent();
                                        rawData = collectionResponse.data.map(function (value) {
                                            return value.getValue().data;
                                        });
                                        this.data[resource_1.name] = rawData;
                                        srcPath = path_1.join(this.pluginDir, "data.json");
                                        srcPath = srcPath.replace("bin", "src");
                                        try {
                                            fs_1.writeFileSync(srcPath, JSON.stringify(this.data, null, 4), {
                                                encoding: "utf-8"
                                            }); // persist data also to src path otherwise it will be lost with each rebuild
                                        }
                                        catch (d) {
                                            console.log("Error writing data file src ", d);
                                        }
                                        try {
                                            fs_1.writeFileSync(path_1.join(__dirname, this.name, "data.json"), JSON.stringify(this.data, null, 4), {
                                                encoding: "utf-8"
                                            });
                                        }
                                        catch (e) {
                                            // console.log("Error writing data file bin");
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        this_2.resources.push(resource_1);
                    }
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
            console.log("Schema not found ", schemaPath);
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
                    for (var _i = 0, _a = clone[i]; _i < _a.length; _i++) {
                        var iterator = _a[_i];
                        if (iterator.hasOwnProperty("id")) {
                            this.updateUris(iterator);
                        }
                    }
                }
            }
        }
    };
    return SchemaPlugin;
}(_1.Service));
exports.SchemaPlugin = SchemaPlugin;
//# sourceMappingURL=schemaPlugin.js.map