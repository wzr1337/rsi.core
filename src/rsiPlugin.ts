import { BehaviorSubject, Subject } from 'rxjs';

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
  status: "ok" | "error";
  error?: Error;
  code?: StatusCode;
  message?: string;
}

export class ElementResponse extends Response {
  data?: BehaviorSubject<Element>;
}

export class CollectionResponse extends Response {
  data?: BehaviorSubject<Element>[];
}

export class Service {
  private _resources:Resource[]=[];
  private _id:string;
  private _specification:string;

  get name() {
   return this.constructor.name.toLowerCase();
  }

  get id() {
   return this._id;
  }

  set id(id:string) {
    this._id = id;
  }

  get resources() {
    return this._resources;
  }

  getResource(name:string):Resource {
    return this._resources.find((r:Resource) => {return r.name === name});
  }

  getSpecification(){
	  return this._specification;
  }

  setSpecification(spec:string){
	  this._specification = spec;
  }
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
  action: "init"|"add"|"move"|"remove"|"update";
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
  name:string;
  change:BehaviorSubject<ResourceUpdate>;

  getResource?(offset?:string|number, limit?:string|number): Promise<CollectionResponse>;         //GET /<service>/<resource>/
  createElement?(state:{}): Promise<ElementResponse>;                                             //POST /<service>/<resource>/
  getElement(elementId:string): Promise<ElementResponse>;                                         //GET /<service>/<resource>/<element>
  updateElement?(elementId:string, difference:any): Promise<ElementResponse>;                     //POST /<service>/<resource>/<element>
  deleteElement?(elementId:string): Promise<ElementResponse>;                                     //DELETE /<service>/<resource>/<element>
  getResourceSpec?():any;

  resourceSubscribable?:Boolean;                                                        //subscribe /<service>/<resource>/
  elementSubscribable?:Boolean;                                                         //subscribe /<service>/<resource>/<element>
}
