"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var uuid_1 = require("uuid");
var Xobject = /** @class */ (function () {
    /**
     * @constructor with default values
     * @param uuid {string} use id or if left empty an v4 uuid is auto generated
     * @param name {string} use name of if left empty an empty string is created
     */
    function Xobject(uuid, name) {
        if (uuid === void 0) { uuid = uuid_1.v4(); }
        if (name === void 0) { name = ""; }
        this.id = uuid;
        this.name = name;
    }
    return Xobject;
}());
exports.Xobject = Xobject;
//# sourceMappingURL=xObject.js.map