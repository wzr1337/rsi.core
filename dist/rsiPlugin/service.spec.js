"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jasmine");
var service_1 = require("./service");
describe("Service", function () {
    it("should be instantiated", function () {
        var service = service_1.Service.getInstance();
        expect(service).toBeDefined();
    });
    it("should have an id", function () {
        var service = service_1.Service.getInstance();
        expect(service.id).toBeDefined();
        expect(service.id).toBe("no id set");
    });
});
//# sourceMappingURL=service.spec.js.map