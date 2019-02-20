"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
require("jasmine");
var resource_1 = require("./resource");
var service_1 = require("./service");
var rxjs_1 = require("rxjs");
var testResource = (function (_super) {
    tslib_1.__extends(testResource, _super);
    function testResource() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return testResource;
}(resource_1.Resource));
describe("Resource", function () {
    var service;
    var resource;
    beforeEach(function () {
        service = service_1.Service.getInstance();
        resource = new testResource(service);
    });
    it("should be instantiated", function () {
        var resource = new testResource(service);
        expect(resource).toBeDefined();
    });
    it("should allow adding elments", function () {
        var element = {
            lastUpdate: 0,
            propertiesChanged: [],
            data: { id: "123", name: "foo" }
        };
        var subject = new rxjs_1.BehaviorSubject(element);
        resource.addElement(subject);
        expect(resource.elements).toBeDefined();
        expect(resource.getElementById("123").getValue()).toBeDefined();
    });
    it("should remove elments correctly", function () {
        var id = "a22325da-a149-4f0e-8cd8-1df2ecf01001";
        var element = {
            lastUpdate: 0,
            propertiesChanged: [],
            data: { id: id, name: "foo" }
        };
        var subject = new rxjs_1.BehaviorSubject(element);
        expect(resource.elements.length).toBe(0);
        resource.addElement(subject);
        expect(resource.elements.length).toBe(1);
        resource.removeElement(id);
        expect(resource.elements.length).toBe(0);
    });
    it("should update elments correctly", function () {
        var id = "a22325da-a149-4f0e-8cd8-1df2ecf01001";
        var element = {
            lastUpdate: 0,
            propertiesChanged: [],
            data: { id: id, name: "foo" }
        };
        var subject = new rxjs_1.BehaviorSubject(element);
        expect(resource.elements.length).toBe(0);
        resource.addElement(subject);
        expect(resource.elements.length).toBe(1);
        var difference = { name: "bar" };
        resource.updateElementById(id, difference, Object.keys(difference));
        expect(resource.getElementById(id).getValue().data.name).toEqual(difference.name);
    });
    it("should add elements in order", function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var id1, element1, subject1, id2, element2, subject2, _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    id1 = "a22325da-a149-4f0e-8cd8-1df2ecf01001";
                    element1 = {
                        lastUpdate: 0,
                        propertiesChanged: [],
                        data: { id: id1, name: "foo" }
                    };
                    subject1 = new rxjs_1.BehaviorSubject(element1);
                    expect(resource.elements.length).toBe(0);
                    resource.addElement(subject1);
                    expect(resource.elements.length).toBe(1);
                    id2 = "a17a63e4-fa9a-4bdd-a67e-40af80481c85";
                    element2 = {
                        lastUpdate: 0,
                        propertiesChanged: [],
                        data: { id: id2, name: "bar" }
                    };
                    subject2 = new rxjs_1.BehaviorSubject(element2);
                    resource.addElement(subject2);
                    expect(resource.elements.length).toBe(2);
                    _a = expect;
                    return [4, resource.getResource()];
                case 1:
                    _a.apply(void 0, [(_b.sent()).data[1].getValue().data.id]).toBe(id2);
                    return [2];
            }
        });
    }); });
});
//# sourceMappingURL=resource.spec.js.map