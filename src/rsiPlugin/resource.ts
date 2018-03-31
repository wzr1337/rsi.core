import { BehaviorSubject } from "rxjs";
import { CollectionResponse, ElementResponse, IElement, IResourceUpdate, Service, XObject } from "../";

export abstract class Resource {
  public elements: Array<BehaviorSubject<IElement>>;

  // subscribe /<service>/<resource>/<element>
  public elementSubscribable?: boolean;
  // subscribe /<service>/<resource>/
  public resourceSubscribable?: boolean;

  // tslint:disable-next-line:variable-name
  protected _change: BehaviorSubject<IResourceUpdate>;

  constructor(protected service: Service) {
    this._change = new BehaviorSubject({ lastUpdate: Date.now(), action: "init" } as IResourceUpdate);
  }

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
  /**
   * Listen on this property to get notified on changes at resource level
   *
   * @readonly
   * @type {BehaviorSubject<IResourceUpdate>}
   * @memberof Resource
   */
  get change(): BehaviorSubject<IResourceUpdate> {
    return this._change;
  }

  // GET /<service>/<resource>/
  public abstract getResource?(offset?: string | number, limit?: string | number): Promise<CollectionResponse>;
  // POST /<service>/<resource>/
  public createElement?(state: {}): Promise<ElementResponse>;
  // GET /<service>/<resource>/<element>
  public async getElement(elementId: string): Promise<ElementResponse> {
    // find the element requested by the client
    return {
      data: this.elements.find((element: BehaviorSubject<IElement>) => {
        return (element.getValue().data as { id: string }).id === elementId;
      }),
      status: "ok"
    };
  }
  // POST /<service>/<resource>/<element>
  public updateElement?(elementId: string, difference: any): Promise<ElementResponse>;
  // DELETE /<service>/<resource>/<element>
  public deleteElement?(elementId: string): Promise<ElementResponse>;
  // GET $spec
  public getResourceSpec?(): {};

  /**
   * Remove an element from the resource
   *
   * @param {string} elementId id of the element to be removed
   * @memberof Resource
   */
  public removeElement(elementId: string) {
    this.elements = this.elements.filter((element: BehaviorSubject<IElement>) => {
      return (element.getValue().data as { id: string }).id !== elementId;
    });
    this._change.next({ lastUpdate: Date.now(), action: "remove" } as IResourceUpdate);
  }

  /**
   * This method adds elements to the resource
   *
   * @param {XObject} data the object to be added
   * @returns {XObject} the completed object added to the resource
   * @memberof Resource
   */
  public addElement(data: XObject): XObject {
    // tslint:disable-next-line:max-line-length
    const newElementObject: XObject = Object.assign(data, { uri: "/" + this.service.name + "/" + this.name + "/" + data.id});
    this.elements.push(new BehaviorSubject<IElement>({
      data: newElementObject,
      lastUpdate: Date.now(),
      propertiesChanged: []
    }));
    /** publish a resource change */
    this._change.next({ lastUpdate: Date.now(), action: "add" } as IResourceUpdate);
    return newElementObject;
  }
}
