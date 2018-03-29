import { BehaviorSubject } from "rxjs";
import { CollectionResponse, ElementResponse, IElement, IResourceUpdate , Service} from "../";

export abstract class Resource {

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
  public getResource?(offset?: string | number, limit?: string | number): Promise<CollectionResponse>;
  // POST /<service>/<resource>/
  public createElement?(state: {}): Promise<ElementResponse>;
  // GET /<service>/<resource>/<element>
  public abstract getElement(elementId: string): Promise<ElementResponse>;
  // POST /<service>/<resource>/<element>
  public updateElement?(elementId: string, difference: any): Promise<ElementResponse>;
  // DELETE /<service>/<resource>/<element>
  public deleteElement?(elementId: string): Promise<ElementResponse>;
  // GET $spec
  public getResourceSpec?(): {};

  abstract get elements(): Array<BehaviorSubject<IElement>>;
}
