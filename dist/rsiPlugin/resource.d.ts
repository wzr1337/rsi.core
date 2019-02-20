import { BehaviorSubject } from "rxjs";
import { CollectionResponse, ElementResponse, IElement, IResourceUpdate, Service } from "../";
export declare abstract class Resource {
    protected service: Service;
    elements: {
        [id: string]: BehaviorSubject<IElement>;
    };
    protected keyOrder: string[];
    elementSubscribable?: boolean;
    resourceSubscribable?: boolean;
    protected _change: BehaviorSubject<IResourceUpdate>;
    constructor(service: Service);
    protected removeFromArray(arr: any[], ...what: any[]): any[];
    readonly name: string;
    readonly change: BehaviorSubject<IResourceUpdate>;
    readonly numberOfElements: number;
    getResource(offset?: string | number, limit?: string | number): Promise<CollectionResponse>;
    createElement?(state: {}): Promise<ElementResponse>;
    getElement(elementId: string): Promise<ElementResponse>;
    updateElement?(elementId: string, difference: any): Promise<ElementResponse>;
    deleteElement?(elementId: string): Promise<ElementResponse>;
    getResourceSpec?(): {};
    removeElement(elementId: string): boolean;
    addElement(element: BehaviorSubject<IElement>): void;
    getElementById(elementId: string): BehaviorSubject<IElement>;
    updateElementById(elementId: string, difference: any, propertiesChanged: string[]): boolean;
}
