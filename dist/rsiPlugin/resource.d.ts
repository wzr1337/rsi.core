import { BehaviorSubject } from "rxjs";
import { CollectionResponse, ElementResponse, IElement, IResourceUpdate, Service } from "../";
export declare abstract class Resource {
    protected service: Service;
    elementSubscribable?: boolean;
    resourceSubscribable?: boolean;
    protected _change: BehaviorSubject<IResourceUpdate>;
    constructor(service: Service);
    /**
     * Retrieve the resource name in all-lower-case
     *
     * @readonly
     * @type {string}
     * @memberof Service
     */
    readonly name: string;
    /**
     * Listen on this property to get notified on changes at resource level
     *
     * @readonly
     * @type {BehaviorSubject<IResourceUpdate>}
     * @memberof Resource
     */
    readonly change: BehaviorSubject<IResourceUpdate>;
    getResource?(offset?: string | number, limit?: string | number): Promise<CollectionResponse>;
    createElement?(state: {}): Promise<ElementResponse>;
    abstract getElement(elementId: string): Promise<ElementResponse>;
    updateElement?(elementId: string, difference: any): Promise<ElementResponse>;
    deleteElement?(elementId: string): Promise<ElementResponse>;
    getResourceSpec?(): {};
    readonly abstract elements: Array<BehaviorSubject<IElement>>;
}
