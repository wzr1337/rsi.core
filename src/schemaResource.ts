import { BehaviorSubject } from "rxjs";
import { v4 } from "uuid";
import { CollectionResponse, ElementResponse, Resource, Service, StatusCode} from "./";

export class SchemaResource extends Resource {
  private elements: Array<BehaviorSubject<any>> = [];

  constructor(private service: Service, public name: string, rawElements: any[], private spec?: any) {
    super();
    this._change = new BehaviorSubject(null);
    this.elements = rawElements.map((data: any) => {
      return new BehaviorSubject<any>({
        data,
        lastUpdate: Date.now(),
        propertiesChanged: []
      });
    });

    this.change.next({
      action: "add",
      lastUpdate: Date.now()
    });
  }

  get elementSubscribable(): boolean {
    return true;
  }

  get resourceSubscribable(): boolean {
    return true;
  }

  public async getElement(elementId: string): Promise<ElementResponse> {
    return {
      data: this.elements.find((element: BehaviorSubject<any>) => {
        return (element.getValue().data as {
          id: string
        }).id === elementId;
      }),
      status: "ok"
    };
  }

  public async getResource(offset?: string | number, limit?: string | number): Promise<CollectionResponse> {
    let data: Array<BehaviorSubject<any>>;

    let o: number = 0;
    let l: number = this.elements.length;

    if (offset && typeof offset === "number") {
      o = offset;
    } else if (offset && typeof offset === "string") {
      const el: any = this.elements.find((x) => x.getValue().data.id === offset);
      if (el) {
        o = this.elements.indexOf(el);
      }
    }

    if (limit && typeof limit === "number") {
      l = o + limit;
    } else if (limit && typeof limit === "string") {
      const el: any = this.elements.find((x) => x.getValue().data.id === limit);
      if (el) {
        l = this.elements.indexOf(el) + 1;
      }
    }

    data = this.elements.slice(o, l);

    return {
      data,
      status: "ok"
    };

  }

  public getResourceSpec() {
    return this.spec;
  }

  public async updateElement(elementId: string, difference: any): Promise<ElementResponse> {
    const elementResponse: ElementResponse = await this.getElement(elementId);
    const element = elementResponse.data;
    const collection: any = element.getValue();

    const newData = Object.assign({}, collection.data, difference);

    element.next({
      data: newData,
      lastUpdate: Date.now(),
      propertiesChanged: []
    });
    this._change.next({
      action: "update",
      lastUpdate: Date.now(),
      newValue: newData,
      oldValue: collection.data
    });
    return {
      status: "ok"
    };
  }

  public async createElement(state: any): Promise<ElementResponse> {
    if (!state.name) {
      return {
        code: StatusCode.INTERNAL_SERVER_ERROR,
        error: new Error("providing a name is mandatory"),
        status: "error"
      };
    }

    if (!state.id) {
      state.id = v4();
    }
    state.uri = "/" + this.service.name.toLowerCase() + "/" + this.name.toLowerCase() + "/" + state.id;

    const newElement: BehaviorSubject<any> = new BehaviorSubject<any>({
      data: state,
      lastUpdate: Date.now(),
      propertiesChanged: []
    });

    this.elements.push(newElement);
    this._change.next({
      action: "add",
      lastUpdate: Date.now()
    });
    return {
      data: newElement,
      status: "ok"
    };
  }

  public async deleteElement(elementId: string): Promise<ElementResponse> {
    const idx = this.elements.findIndex((element: BehaviorSubject<any>, index: number) => {
      return (element.getValue().data as {
        id: string
      }).id === elementId;
    });

    if (-1 !== idx) {
      this.elements.splice(idx, 1); // remove one item from the collections array
      this._change.next({
        action: "remove",
        lastUpdate: Date.now()
      });

      return {
        status: "ok"
      };
    }

    return {
      code: 404,
      message: "Element can not be found",
      status: "error"
    };
  }
}
