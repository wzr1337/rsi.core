import "jasmine";
import { IElement } from "rsiPlugin";
import { BehaviorSubject } from "rxjs";
import { Resource } from "./resource";
import { Service } from "./service";

class TestResource extends Resource {
}

describe("Resource", () => {

  let service: Service;
  let resource: Resource;

  beforeEach(() => {
    service = Service.getInstance();
    resource = new TestResource(service);
  });

  it("should be instantiated", () => {
    expect(resource).toBeDefined();
  });

  // tslint:disable 
  it("should allow adding elments", () => {
    const element: IElement = {
      lastUpdate: 0,
      propertiesChanged: [],
      data: {id: "123", name: "foo"}
    };
    const subject = new BehaviorSubject(element);
    resource.addElement(subject);

    expect(resource.elements).toBeDefined();
    expect(resource.getElementById("123").getValue()).toBeDefined();
  });

  it("should remove elments correctly", () => {
    const id = "a22325da-a149-4f0e-8cd8-1df2ecf01001";
    const element: IElement = {
      lastUpdate: 0,
      propertiesChanged: [],
      data: {id, name: "foo"}
    };
    const subject = new BehaviorSubject(element);
    expect(resource.numberOfElements).toBe(0);
    resource.addElement(subject);
    expect(resource.numberOfElements).toBe(1);
    resource.removeElement(id);
    expect(resource.numberOfElements).toBe(0);
  });

  it("should update elments correctly", () => {
    const id = "a22325da-a149-4f0e-8cd8-1df2ecf01001";
    const element: IElement = {
      lastUpdate: 0,
      propertiesChanged: [],
      data: {id, name: "foo"}
    };
    const subject = new BehaviorSubject(element);
    expect(resource.numberOfElements).toBe(0);
    resource.addElement(subject);
    expect(resource.numberOfElements).toBe(1);
    const difference = {name: "bar"};
    resource.updateElementById(id, difference, Object.keys(difference));
    expect(resource.getElementById(id).getValue().data.name).toEqual(difference.name);
  });

  it("should add elements in order", async () => {
    const id1 = "a22325da-a149-4f0e-8cd8-1df2ecf01001";
    const element1: IElement = {
      lastUpdate: 0,
      propertiesChanged: [],
      data: {id: id1, name: "foo"}
    };
    const subject1 = new BehaviorSubject(element1);
    expect(resource.numberOfElements).toBe(0);
    resource.addElement(subject1);
    expect(resource.numberOfElements).toBe(1);
    const id2 = "a17a63e4-fa9a-4bdd-a67e-40af80481c85";
    const element2: IElement = {
      lastUpdate: 0,
      propertiesChanged: [],
      data: {id: id2, name: "bar"}
    };
    const subject2 = new BehaviorSubject(element2);
    resource.addElement(subject2);
    expect(resource.numberOfElements).toBe(2);
    expect((await resource.getResource()).data[1].getValue().data.id).toBe(id2);
  });

});
