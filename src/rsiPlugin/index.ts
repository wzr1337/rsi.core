import { Service } from "./service";
export { Service } from "./service";
export { Resource } from "./resource";

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
