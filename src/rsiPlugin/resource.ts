import { BehaviorSubject } from "rxjs";
import { CollectionResponse, ElementResponse, IElement, IResourceUpdate, Service } from "../";

export abstract class Resource {
  public elements: {[id: string]: BehaviorSubject<IElement>} = {};
  // subscribe /<service>/<resource>/<element>
  public elementSubscribable?: boolean;
  // subscribe /<service>/<resource>/
  public resourceSubscribable?: boolean;

  // tslint:disable-next-line:variable-name
  protected _change: BehaviorSubject<IResourceUpdate>;

  protected keyOrder: string[] = [];

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

  get numberOfElements(): number {
    return Object.keys(this.elements).length;
  }

  /**
   * This method responds to GET requests on /<service>/<resource>/ level
   *
   * @param {(string | number)} [offset] collection offset
   * @param {(string | number)} [limit] limit the number of items per page
   * @returns {Promise<CollectionResponse>}
   * @memberof Resource
   */
  public async getResource(
    offset?: string | number,
    limit?: string | number
  ): Promise<CollectionResponse> {
    // retriev all element
    const resp: Array<BehaviorSubject<IElement>> = [];

    if (
      (typeof offset === "number" && typeof limit === "number") ||
      (typeof limit === "number" && !offset) ||
      (typeof offset === "number" && !limit) ||
      (!offset && !limit)
    ) {
      for (const key of this.keyOrder.slice(offset as number, limit as number)) {
        resp.push(this.elements[key]);
      }
    }
    return { status: "ok", data: resp };
  }

  /**
   * This method responds to POST requests on /<service>/<resource>/ level
   *
   * @param {object} state of the element to create
   * @returns {Promise<ElementResponse>}
   * @memberof Resource
   */
  public async createElement?(state: {}): Promise<ElementResponse>;

  /**
   * This method responds to GET requests on /<service>/<resource>/<element> level
   *
   * @param {string} elementId the element in focus
   * @returns {Promise<ElementResponse>}
   * @memberof Resource
   */
  public async getElement(elementId: string): Promise<ElementResponse> {
    // find the element requested by the client
    return {
      data: this.elements[elementId],
      status: "ok"
    };
  }

  /**
   * This method responds to POST requests on /<service>/<resource>/<element> level
   *
   * @param {string} elementId id of the element of choice
   * @param {*} difference the diffence in state to be applied
   * @returns {Promise<ElementResponse>}
   * @memberof Resource
   */
  public updateElement?(elementId: string, difference: any): Promise<ElementResponse>;

  /**
   * This method responds to DELETE requests on /<service>/<resource>/<element> level
   *
   * @param {string} elementId the id of the lement of choice
   * @returns {Promise<ElementResponse>}
   * @memberof Resource
   */
  public deleteElement?(elementId: string): Promise<ElementResponse>;

  /**
   * This method responds to GET requests on /<service>/<resource>/$spec queries
   *
   * @returns {object}
   * @memberof Resource
   */
  public getResourceSpec?(): {};

  /**
   * Remove a raw element from the resource
   *
   * @param {string} elementId id of the element to be removed
   * @returns {boolean} success of removal
   * @memberof Resource
   */
  public removeElement(elementId: string): boolean {
    const origLen = this.keyOrder.length;
    this.keyOrder = this.removeFromArray(this.keyOrder, elementId);
    delete this.elements[elementId];
    if (this.keyOrder.length < origLen) {
      /** publish a resource change */
      this._change.next({ lastUpdate: Date.now(), action: "remove" } as IResourceUpdate);
      return true;
    } else {
      return false;
    }
  }

  /**
   * This method adds raw element to the resource
   *
   * @param {BehaviorSubject<IElement>} element element to be added
   * @memberof Resource
   */
  public addElement(element: BehaviorSubject<IElement>) {
    const id = element.getValue().data.id;
    this.elements[id] = element;
    this.keyOrder.push(id);
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
    return this.elements[elementId];
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

  protected removeFromArray(arr: any[], ...what: any[]) {
    let $what;
    const a = what;
    let L = a.length;
    let ax;
    while (L > 1 && arr.length) {
        $what = a[--L];
        // tslint:disable-next-line: no-conditional-assignment
        while ((ax = arr.indexOf($what)) !== -1) {
            arr.splice(ax, 1);
        }
    }
    return arr;
  }
}
