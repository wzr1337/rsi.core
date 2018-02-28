import { CollectionResponse, ElementResponse, Resource, Service } from "./";
export declare class SchemaResource extends Resource {
    private service;
    name: string;
    private spec;
    private elements;
    constructor(service: Service, name: string, rawElements: any[], spec?: any);
    readonly elementSubscribable: boolean;
    readonly resourceSubscribable: boolean;
    getElement(elementId: string): Promise<ElementResponse>;
    getResource(offset?: string | number, limit?: string | number): Promise<CollectionResponse>;
    getResourceSpec(): any;
    updateElement(elementId: string, difference: any): Promise<ElementResponse>;
    createElement(state: any): Promise<ElementResponse>;
    deleteElement(elementId: string): Promise<ElementResponse>;
}
