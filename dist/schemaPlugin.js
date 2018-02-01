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
var fs = require("fs");
var path = require("path");
var rxjs_1 = require("rxjs");
var rsiPlugin_1 = require("./rsiPlugin");
var uuid = require("uuid");
var path_1 = require("path");
var fs_1 = require("fs");
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
        if (fs_1.existsSync(path_1.join(this.pluginDir, 'data.json'))) {
            var dataPath = path_1.join(this.pluginDir, 'data.json');
            var d = fs.readFileSync(dataPath, 'utf-8');
            try {
                this.data = JSON.parse(d);
            }
            catch (e) {
                console.log('Error parsing data for schema plugin ', this.name);
            }
        }
        else {
            console.log('DATA NOT FOUND ', path_1.join(this.pluginDir, 'data.json'));
        }
    };
    SchemaPlugin.prototype.readSchema = function () {
        var _this = this;
        var schemaPath = path_1.join(this.pluginDir, 'schema.json');
        if (fs_1.existsSync(schemaPath)) {
            var d = fs_1.readFileSync(schemaPath, 'utf-8');
            try {
                var content = JSON.parse(d);
                this.setSpecification(content);
                for (var resourceDef in content.resources) {
                    var data = this.data[resourceDef] || [];
                    if (Array.isArray(this.data[resourceDef])) {
                        this.data[resourceDef].forEach(function (x) {
                            _this.elementKeyMap[x.id] = {
                                resource: resourceDef,
                                element: x
                            };
                        });
                    }
                }
                var _loop_1 = function () {
                    var data = this_1.data[resourceDef] || [];
                    this_1.updateUris(data);
                    var resource = new SchemaResource(this_1, resourceDef, data, content.resources[resourceDef]);
                    this_1.resourceMap[resourceDef] = resource;
                    resource.change.subscribe(function () {
                        var rawData = resource.getResource().data.map(function (value) {
                            return value.getValue().data;
                        });
                        _this.data[resource.name] = rawData;
                        var srcPath = path.join(_this.pluginDir, 'data.json');
                        srcPath = srcPath.replace('bin', 'src');
                        try {
                            fs.writeFileSync(srcPath, JSON.stringify(_this.data, null, 4), { encoding: 'utf-8' }); // persist data also to src path otherwise it will be lost with each rebuild
                        }
                        catch (d) {
                            console.log('Error writing data file src ', d);
                        }
                        try {
                            fs.writeFileSync(path.join(__dirname, _this.name, 'data.json'), JSON.stringify(_this.data, null, 4), { encoding: 'utf-8' });
                        }
                        catch (e) {
                            //console.log("Error writing data file bin");
                        }
                    });
                    this_1.resources.push(resource);
                };
                var this_1 = this;
                for (var resourceDef in content.resources) {
                    _loop_1();
                }
            }
            catch (e) {
                console.log('Error Reading schema for schema plugin ', schemaPath);
                console.log(e);
            }
        }
        else {
            console.log('Schema not found ', path_1.join(this.pluginDir, 'schema.json'));
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
            if (typeof clone[i] === 'object') {
                if (clone[i] && clone[i].hasOwnProperty('id')) {
                    this.updateUris(clone[i]);
                }
                else if (Array.isArray(clone[i])) {
                    for (var y = 0; y < clone[i].length; y++) {
                        if (clone[i][y].hasOwnProperty('id')) {
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
var SchemaResource = /** @class */ (function () {
    function SchemaResource(service, name, rawElements, spec) {
        this.service = service;
        this.name = name;
        this.spec = spec;
        this._elements = [];
        this._change = new rxjs_1.BehaviorSubject(null);
        this._elements = rawElements.map(function (x) {
            return new rxjs_1.BehaviorSubject({
                lastUpdate: Date.now(),
                propertiesChanged: [],
                data: x
            });
        });
        this._change.next({ lastUpdate: Date.now(), action: 'add' });
    }
    Object.defineProperty(SchemaResource.prototype, "elementSubscribable", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(SchemaResource.prototype, "resourceSubscribable", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(SchemaResource.prototype, "change", {
        get: function () {
            return this._change;
        },
        enumerable: true,
        configurable: true
    });
    SchemaResource.prototype.getElement = function (elementId) {
        return {
            status: 'ok',
            data: this._elements.find(function (element) {
                return element.getValue().data.id === elementId;
            })
        };
    };
    ;
    SchemaResource.prototype.getResource = function (offset, limit) {
        var resp;
        var o = 0;
        var l = this._elements.length;
        if (offset && typeof offset === 'number') {
            o = offset;
        }
        else if (offset && typeof offset === 'string') {
            var el = this._elements.find(function (x) { return x.getValue().data.id === offset; });
            if (el) {
                o = this._elements.indexOf(el);
            }
        }
        if (limit && typeof limit === 'number') {
            l = o + limit;
        }
        else if (limit && typeof limit === 'string') {
            var el = this._elements.find(function (x) { return x.getValue().data.id === limit; });
            if (el) {
                l = this._elements.indexOf(el) + 1;
            }
        }
        resp = this._elements.slice(o, l);
        return { status: 'ok', data: resp };
    };
    ;
    SchemaResource.prototype.getResourceSpec = function () {
        return this.spec;
    };
    SchemaResource.prototype.updateElement = function (elementId, difference) {
        var element = this.getElement(elementId).data;
        var collection = element.getValue();
        var newData = Object.assign({}, collection.data, difference);
        element.next({
            lastUpdate: Date.now(),
            propertiesChanged: [],
            data: newData
        });
        this._change.next({ lastUpdate: Date.now(), action: 'update', oldValue: collection.data, newValue: newData });
        return { status: 'ok' };
    };
    SchemaResource.prototype.createElement = function (state) {
        if (!state.name)
            return {
                status: 'error',
                error: new Error('providing a name is mandatory'),
                code: rsiPlugin_1.StatusCode.INTERNAL_SERVER_ERROR
            };
        if (!state.id) {
            state.id = uuid.v1();
        }
        state.uri = '/' + this.service.name.toLowerCase() + '/' + this.name.toLowerCase() + '/' + state.id;
        var newElement = new rxjs_1.BehaviorSubject({
            lastUpdate: Date.now(),
            propertiesChanged: [],
            data: state
        });
        this._elements.push(newElement);
        this._change.next({ lastUpdate: Date.now(), action: 'add' });
        return { status: 'ok', data: newElement };
    };
    ;
    SchemaResource.prototype.deleteElement = function (elementId) {
        var idx = this._elements.findIndex(function (element, index) {
            return element.getValue().data.id === elementId;
        });
        if (-1 !== idx) {
            this._elements.splice(idx, 1); //remove one item from the collections array
            this._change.next({ lastUpdate: Date.now(), action: 'remove' });
            return { status: 'ok' };
        }
        return { status: 'error', code: 404, message: 'Element can not be found' };
    };
    return SchemaResource;
}());
//# sourceMappingURL=schemaPlugin.js.map