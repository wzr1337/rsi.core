import { BehaviorSubject } from "rxjs";
import { CollectionResponse, ElementResponse, IElement, IResourceUpdate, Service } from "../";
export declare abstract class Resource {
    protected service: Service;
    elements: Array<BehaviorSubject<IElement>>;
    elementSubscribable?: boolean;
    resourceSubscribable?: boolean;
    protected _change: BehaviorSubject<IResourceUpdate>;
    constructor(service: Service);
    readonly name: string;
    readonly change: BehaviorSubject<IResourceUpdate>;
    getResource(offset?: string | number, limit?: string | number): Promise<CollectionResponse>;
    createElement?(state: {}): Promise<ElementResponse>;
    getElement(elementId: string): Promise<ElementResponse>;
    updateElement?(elementId: string, difference: any): Promise<ElementResponse>;
    deleteElement?(elementId: string): Promise<ElementResponse>;
    getResourceSpec?(): {};
    removeElement(elementId: string): boolean;
    addElement(element: BehaviorSubject<IElement>): void;
}
