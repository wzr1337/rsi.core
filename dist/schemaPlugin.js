"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var fs_1 = require("fs");
var path_1 = require("path");
var _1 = require("./");
var SchemaPlugin = (function (_super) {
    tslib_1.__extends(SchemaPlugin, _super);
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
                            data[resourceDef].forEach(function (x) {
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
                        var resource_1 = new _1.SchemaResource(this_2, resourceDef, data, content.resources[resourceDef]);
                        this_2.resourceMap[resourceDef] = resource_1;
                        resource_1.change.subscribe(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                            var collectionResponse, rawData, srcPath;
                            return tslib_1.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4, resource_1.getResource()];
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
                                            });
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
                                        }
                                        return [2];
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