import { BehaviorSubject } from "rxjs";
import { CollectionResponse, ElementResponse, IResourceUpdate } from "./";

export abstract class Resource {

  // subscribe /<service>/<resource>/<element>
  public elementSubscribable?: boolean;
  // subscribe /<service>/<resource>/
  public resourceSubscribable?: boolean;

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

  // tslint:disable-next-line:variable-name
  protected _change: BehaviorSubject<IResourceUpdate>;
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
}
