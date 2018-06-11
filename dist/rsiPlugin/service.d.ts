import { Resource } from "../";
export declare class Service {
    static getInstance(): Service;
    private static instance;
    id: string;
    readonly resources: Resource[];
    protected specification: string;
    protected constructor();
    readonly name: string;
    getResource(name: string): Resource;
    getSpecification(): string;
    setSpecification(spec: string): void;
    addResource(resource: Resource): void;
}
