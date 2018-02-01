import { BehaviorSubject } from 'rxjs';
export declare enum StatusCode {
    "OK" = 200,
    "CREATED" = 201,
    "ACCEPTED" = 202,
    "BAD_REQUEST" = 400,
    "FORBIDDEN" = 403,
    "NOT_FOUND" = 404,
    "INTERNAL_SERVER_ERROR" = 500,
    "NOT_IMPLEMENTED" = 501,
    "SERVICE_UNAVAILABLE" = 503,
}
export declare class Response {
    status: "ok" | "error";
    error?: Error;
    code?: StatusCode;
    message?: string;
}
export declare class ElementResponse extends Response {
    data?: BehaviorSubject<Element>;
}
export declare class CollectionResponse extends Response {
    data?: BehaviorSubject<Element>[];
}
export declare class Service {
    private _resources;
    private _id;
    private _specification;
    readonly name: string;
    id: string;
    readonly resources: Resource[];
    getResource(name: string): Resource;
    getSpecification(): string;
    setSpecification(spec: string): void;
}
export interface Element {
    lastUpdate: number;
    propertiesChanged: string[];
    data: any;
}
export interface ResourceUpdate {
    lastUpdate: number;
    oldValue?: any;
    newValue?: any;
    action: "init" | "add" | "move" | "remove" | "update";
}
export interface ServiceRepoAdd {
    (service: Service): void;
}
export interface ServiceAdder {
    (repo: ServiceRepoAdd): void;
}
export interface Addon {
    addServices: ServiceAdder;
}
export interface Resource {
    name: string;
    change: BehaviorSubject<ResourceUpdate>;
    getResource?(offset?: string | number, limit?: string | number): CollectionResponse;
    createElement?(state: {}): ElementResponse;
    getElement(elementId: string): ElementResponse;
    updateElement?(elementId: string, difference: any): ElementResponse;
    deleteElement?(elementId: string): ElementResponse;
    getResourceSpec?(): any;
    resourceSubscribable?: Boolean;
    elementSubscribable?: Boolean;
}
