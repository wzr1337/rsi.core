import "jasmine";
import { Service } from "./service";

describe("Service", () => {
    it("should be instantiated", () => {
        const service = Service.getInstance();
        expect(service).toBeDefined()
    });
    it("should have an id", () => {
        const service = Service.getInstance();
        expect(service.id).toBeDefined();
        expect(service.id).toBe("no id set");
    })
});
