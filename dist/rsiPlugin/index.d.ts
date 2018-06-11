import { Service } from "./service";
export { Service } from "./service";
export { Resource } from "./resource";
export declare enum StatusCode {
    "OK" = 200,
    "CREATED" = 201,
    "ACCEPTED" = 202,
    "BAD_REQUEST" = 400,
    "FORBIDDEN" = 403,
    "NOT_FOUND" = 404,
    "INTERNAL_SERVER_ERROR" = 500,
    "NOT_IMPLEMENTED" = 501,
    "SERVICE_UNAVAILABLE" = 503
}
export interface IElement {
    lastUpdate: number;
    propertiesChanged: string[];
    data: any;
}
export interface IResourceUpdate {
    lastUpdate: number;
    oldValue?: any;
    newValue?: any;
    action: "init" | "add" | "move" | "remove" | "update";
}
export declare type IServiceRepoAdd = (service: Service) => void;
export declare type IServiceAdder = (repo: IServiceRepoAdd) => void;
export interface IAddon {
    addServices: IServiceAdder;
}
