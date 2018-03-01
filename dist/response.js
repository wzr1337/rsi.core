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
// tslint:disable-next-line:max-classes-per-file
var Response = /** @class */ (function () {
    function Response() {
    }
    return Response;
}());
exports.Response = Response;
// tslint:disable-next-line:max-classes-per-file
var ElementResponse = /** @class */ (function (_super) {
    __extends(ElementResponse, _super);
    function ElementResponse() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ElementResponse;
}(Response));
exports.ElementResponse = ElementResponse;
// tslint:disable-next-line:max-classes-per-file
var CollectionResponse = /** @class */ (function (_super) {
    __extends(CollectionResponse, _super);
    function CollectionResponse() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CollectionResponse;
}(Response));
exports.CollectionResponse = CollectionResponse;
//# sourceMappingURL=response.js.map