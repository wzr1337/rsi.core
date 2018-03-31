"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var uuid_1 = require("uuid");
var XObject = /** @class */ (function () {
    /**
     * @constructor with default values
     * @param id {string} use id or if left empty an v4 uuid is auto generated
     * @param name {string} use name of if left empty an empty string is created
     */
    function XObject(id, name) {
        if (id === void 0) { id = uuid_1.v4(); }
        if (name === void 0) { name = ""; }
        this.id = id;
        this.name = name;
    }
    return XObject;
}());
exports.XObject = XObject;
//# sourceMappingURL=xObject.js.map