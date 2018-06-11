"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var uuid_1 = require("uuid");
var XObject = (function () {
    function XObject(id, name) {
        if (id === void 0) { id = uuid_1.v4(); }
        if (name === void 0) { name = ""; }
        this.id = id;
        this.name = name;
    }
    return XObject;
}());
exports.XObject = XObject;
//# sourceMappingURL=xobject.js.map