import { BehaviorSubject, Subject } from "rxjs";
import { v4 } from "uuid";

export enum StatusCode {
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

export class Response {
  public status: "ok" | "error";
  public error?: Error;
  public code?: StatusCode;
  public message?: string;
}

export class ElementResponse extends Response {
  public data?: BehaviorSubject<IElement>;
}

export class CollectionResponse extends Response {
  public data?: Array<BehaviorSubject<IElement>>;
}

/**
 * The general service class
 *
 * @export
 * @class Service
 */
export class Service {
  protected _resources: Resource[] = [];
  private _id: string = "no id set";
  private _specification: string = "";

  /**
   * Retrieve the service name in all-lower-case
   *
   * @readonly
   * @type {string}
   * @memberof Service
   */
  get name(): string {
   return this.constructor.name.toLowerCase();
  }

  /**
   * Retrive the services id
   *
   * @type {string}
   * @memberof Service
   */
  get id(): string {
   return this._id;
  }

  /**
   * Setter for service id
   *
   * @param id {string} set the id
   * @memberof Service
   */
  set id(id: string) {
    this._id = id;
  }

  /**
   * Get a list of resources providesd by the service
   *
   * @readonly
   * @type {Resource[]} the rescoures provided by the service
   * @memberof Service
   */
  get resources(): Resource[] {
    return this._resources;
  }

  /**
   * Get a dedicates of resource by name
   *
   * @param {string} name the resource name
   * @returns {Resource}
   * @memberof Service
   */
  public getResource(name: string): Resource {
    return this._resources.find((r: Resource) => r.name === name);
  }

  public getSpecification(): string {
	  return this._specification;
  }

  public setSpecification(spec: string) {
	  this._specification = spec;
  }
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
  action: "init"|"add"|"move"|"remove"|"update";
}

export type IServiceRepoAdd = (service: Service) => void;

export type IServiceAdder = (repo: IServiceRepoAdd) => void;

export interface IAddon {
  addServices: IServiceAdder;

}

export abstract class Resource {

  /**
   * Retrieve the resource name in all-lower-case
   *
   * @readonly
   * @type {string}
   * @memberof Service
   */
  get name(): string {
    return this.constructor.name.toLowerCase();
  }

  protected _change: BehaviorSubject<IResourceUpdate>;
  get change(): BehaviorSubject<IResourceUpdate> {
    return this._change;
  }

  public getResource?(offset?: string|number, limit?: string|number): Promise<CollectionResponse>;         //GET /<service>/<resource>/
  public createElement?(state: {}): Promise<ElementResponse>;                                             //POST /<service>/<resource>/
  public abstract getElement(elementId: string): Promise<ElementResponse>;                                         //GET /<service>/<resource>/<element>
  public updateElement?(elementId: string, difference: any): Promise<ElementResponse>;                     //POST /<service>/<resource>/<element>
  public deleteElement?(elementId: string): Promise<ElementResponse>;                                     //DELETE /<service>/<resource>/<element>
  public getResourceSpec?(): any;

  public resourceSubscribable?: Boolean;                                                        //subscribe /<service>/<resource>/
  public elementSubscribable?: Boolean;                                                         //subscribe /<service>/<resource>/<element>
}

export abstract class Xobject {
  private _id: string;
  private _name: string;

  /**
   * @constructor with default values
   * @param uuid {string} use id or if left empty an v4 uuid is auto generated
   * @param name {string} use name of if left empty an empty string is created
   */
  constructor(uuid: string = v4(), name: string = "") {
    this._id = uuid;
    this._name = name;
  }

  /**
   * Retrieve the xObject name
   *
   * @type {string}
   * @memberof Xobject
   */
  get name(): string {
    return this._name;
  }

  /**
   * Setter for xObject name
   *
   * @param name {string} set the name
   * @memberof Xobject
   */
  set name(name: string) {
    this._name = name || "";
  }

  /**
   * Retrieve the xObject uuid
   *
   * @type {string}
   * @memberof Xobject
   */
  get uuid(): string {
    return this._id;
  }
}
