import { BehaviorSubject } from "rxjs";
import { CollectionResponse, ElementResponse, IResourceUpdate } from "./";
export declare abstract class Resource {
    elementSubscribable?: boolean;
    resourceSubscribable?: boolean;
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
    getResourceSpec?(): {};
}
