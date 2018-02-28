import { BehaviorSubject } from "rxjs";
import { IElement, StatusCode } from "./";

// tslint:disable-next-line:max-classes-per-file
export class Response {
  public status: "ok" | "error";
  public error?: Error;
  public code?: StatusCode;
  public message?: string;
}

// tslint:disable-next-line:max-classes-per-file
export class ElementResponse extends Response {
  public data?: BehaviorSubject<IElement>;
}

// tslint:disable-next-line:max-classes-per-file
export class CollectionResponse extends Response {
  public data?: Array<BehaviorSubject<IElement>>;
}
