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
    data?: BehaviorSubject<IElement>;
}
export declare class CollectionResponse extends Response {
    data?: BehaviorSubject<IElement>[];
}
/**
 * The general service class
 *
 * @export
 * @class Service
 */
export declare class Service {
    protected _resources: Resource[];
    private _id;
    private _specification;
    /**
     * Retrieve the service name in all-lower-case
     *
     * @readonly
     * @type {string}
     * @memberof Service
     */
    readonly name: string;
    /**
     * Retrive the services id
     *
     * @type {string}
     * @memberof Service
     */
    /**
     * Setter for service id
     *
     * @param id {string} set the id
     * @memberof Service
     */
    id: string;
    /**
     * Get a list of resources providesd by the service
     *
     * @readonly
     * @type {Resource[]} the rescoures provided by the service
     * @memberof Service
     */
    readonly resources: Resource[];
    /**
     * Get a dedicates of resource by name
     *
     * @param {string} name the resource name
     * @returns {Resource}
     * @memberof Service
     */
    getResource(name: string): Resource;
    getSpecification(): string;
    setSpecification(spec: string): void;
}
/**
 * This is an interface definition for the viwi element level access
 *
 * @export
 * @interface Element
 */
export interface IElement {
    lastUpdate: number;
    propertiesChanged: string[];
    data: any;
}
/**
 * The resource updates are handled with this interface
 *
 * @export
 * @interface ResourceUpdate
 */
export interface IResourceUpdate {
    lastUpdate: number;
    oldValue?: any;
    newValue?: any;
    action: "init" | "add" | "move" | "remove" | "update";
}
export interface IServiceRepoAdd {
    (service: Service): void;
}
export interface IServiceAdder {
    (repo: IServiceRepoAdd): void;
}
export interface IAddon {
    addServices: IServiceAdder;
}
export declare abstract class Resource {
    /**
     * Retrieve the resource name in all-lower-case
     *
     * @readonly
     * @type {string}
     * @memberof Service
     */
    readonly name: string;
    protected _change: BehaviorSubject<IResourceUpdate>;
    readonly change: BehaviorSubject<IResourceUpdate>;
    getResource?(offset?: string | number, limit?: string | number): Promise<CollectionResponse>;
    createElement?(state: {}): Promise<ElementResponse>;
    abstract getElement(elementId: string): Promise<ElementResponse>;
    updateElement?(elementId: string, difference: any): Promise<ElementResponse>;
    deleteElement?(elementId: string): Promise<ElementResponse>;
    getResourceSpec?(): any;
    resourceSubscribable?: Boolean;
    elementSubscribable?: Boolean;
}
export declare abstract class Xobject {
    private _id;
    private _name;
    /**
     * @constructor with default values
     * @param uuid {string} use id or if left empty an v4 uuid is auto generated
     * @param name {string} use name of if left empty an empty string is created
     */
    constructor(uuid?: string, name?: string);
    /**
     * Retrieve the xObject name
     *
     * @type {string}
     * @memberof Xobject
     */
    /**
     * Setter for xObject name
     *
     * @param name {string} set the name
     * @memberof Xobject
     */
    name: string;
    /**
     * Retrieve the xObject uuid
     *
     * @type {string}
     * @memberof Xobject
     */
    readonly uuid: string;
}
