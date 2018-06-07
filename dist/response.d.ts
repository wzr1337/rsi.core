import { BehaviorSubject } from "rxjs";
import { IElement, StatusCode } from "./";
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
    data?: Array<BehaviorSubject<IElement>>;
}
