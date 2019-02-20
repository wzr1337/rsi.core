import { BehaviorSubject } from "rxjs";
import { CollectionResponse, ElementResponse, IElement, IResourceUpdate, Service } from "../";

export abstract class Resource {
  public elements: Array<BehaviorSubject<IElement>> = [];

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
    return this.constructor.name;
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
  public async getResource(
    offset?: string | number,
    limit?: string | number
  ): Promise<CollectionResponse> {
    // retriev all element
    let resp: Array<BehaviorSubject<IElement>>;

    if (
      (typeof offset === "number" && typeof limit === "number") ||
      (typeof limit === "number" && !offset) ||
      (typeof offset === "number" && !limit) ||
      (!offset && !limit)
    ) {
      resp = this.elements.slice(offset as number, limit as number);
    }
    return { status: "ok", data: resp };
  }

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
   * @returns {boolean} success of removal
   * @memberof Resource
   */
  public removeElement(elementId: string): boolean {
    const origLen = this.elements.length;
    this.elements = this.elements.filter((element: BehaviorSubject<IElement>) => {
      return (element.getValue().data as { id: string }).id !== elementId;
    });
    if (this.elements.length < origLen) {
      /** publish a resource change */
      this._change.next({ lastUpdate: Date.now(), action: "remove" } as IResourceUpdate);
      return true;
    } else {
      return false;
    }
  }

  /**
   * This method adds elements to the resource
   *
   * @param {BehaviorSubject<IElement>} element to be added
   * @memberof Resource
   */
  public addElement(element: BehaviorSubject<IElement>) {
    this.elements.push(element);
    /** publish a resource change */
    this._change.next({ lastUpdate: Date.now(), action: "add" } as IResourceUpdate);
  }

  /**
   * Get the raw element from the resource
   *
   * @param {string} elementId id of the element to be removed
   * @returns {BehaviorSubject<IElement>} success of removal
   * @memberof Resource
   */
  public getElementById(elementId: string): BehaviorSubject<IElement> {
    return this.elements.filter((element: BehaviorSubject<IElement>) => {
      // return element.getValue().data && (element.getValue().data as { id: string }).id !== elementId;
      return (element.getValue().data as { id: string }).id === elementId;
    })[0];
  }

  /**
   * Updates a raw element by ID
   *
   * @param {string} elementId
   * @param {*} difference changing and adding to an element
   * @param {string[]} propertiesChanged
   * @returns {boolean}
   * @memberof Vehicles
   */
  public updateElementById(elementId: string, difference: any, propertiesChanged: string[]): boolean {
    const subject = this.getElementById(elementId);
    if (!subject) {
      return false;
    }
    const element = {
      data : {
        ...subject.getValue().data,
        ...difference
      },
      lastUpdate: Date.now(),
      propertiesChanged
    };
    subject.next(element);
    return true;
  }
}
