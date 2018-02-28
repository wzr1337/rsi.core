import fs = require("fs");
import { existsSync, readFileSync } from "fs";
import path = require("path");
import { join } from "path";
import { BehaviorSubject } from "rxjs";
import * as uuid from "uuid";
import { CollectionResponse, ElementResponse, IResourceUpdate, Resource, Service, StatusCode } from "./rsiPlugin";

export class SchemaPlugin extends Service {

    public name: string;
    public elements: any[] = [];
    public elementKeyMap: any = {};
    public model: any = {};
    public schema: any = {};
    public data: any = {};
    public resourceMap: any = {};

    public pluginDir: string;

    constructor() {
        super();

    }

    public init() {
        this.readData();
        this.readSchema();
        this.onReady();
    }

    // tslint:disable-next-line:no-empty
    public onReady() {

    }

    public readData() {
        if (existsSync(join(this.pluginDir, "data.json"))) {
            const dataPath: string = join(this.pluginDir, "data.json");
            const d: string = fs.readFileSync(dataPath, "utf-8") as string;
            try {
                this.data = JSON.parse(d);
            } catch (e) {
                console.log("Error parsing data for schema plugin ", this.name);
            }
        } else {
            console.log("DATA NOT FOUND ", join(this.pluginDir, "data.json"));
        }
    }

    public readSchema() {
        const schemaPath: string = join(this.pluginDir, "schema.json");

        if (existsSync(schemaPath)) {

            const d: string = readFileSync(schemaPath, "utf-8") as string;
            try {
                const content = JSON.parse(d);

                this.setSpecification(content);

                for (const resourceDef in content.resources) {
                    const data: any = this.data[resourceDef] || [];

                    if (Array.isArray(this.data[resourceDef])) {
                        this.data[resourceDef].forEach((x: any) => {
                            this.elementKeyMap[x.id] = {
                                resource: resourceDef,
                                element: x,
                            };
                        });
                    }
                }

                for (let resourceDef in content.resources) {
                    const data: any = this.data[resourceDef] || [];
                    this.updateUris(data);
                    const resource: SchemaResource = new SchemaResource(this, resourceDef, data, content.resources[resourceDef]);
                    this.resourceMap[resourceDef] = resource;
                    resource.change.subscribe(async () => {
                        const collectionResponse: CollectionResponse = await resource.getResource();
                        const rawData = collectionResponse.data.map((value: BehaviorSubject<any>) => {
                            return value.getValue().data;
                        });
                        this.data[resource.name] = rawData;
                        let srcPath = path.join(this.pluginDir, "data.json");
                        srcPath = srcPath.replace("bin", "src");
                        try {
                            fs.writeFileSync(srcPath, JSON.stringify(this.data, null, 4), { encoding: "utf-8" }); // persist data also to src path otherwise it will be lost with each rebuild
                        } catch (d) {
                            console.log("Error writing data file src ", d);
                        }
                        try {
                            fs.writeFileSync(path.join(__dirname, this.name, "data.json"), JSON.stringify(this.data, null, 4), { encoding: "utf-8" });

                        } catch (e) {
                            //console.log("Error writing data file bin");
                        }

                    });
                    this.resources.push(resource);
                }
            } catch (e) {
                console.log("Error Reading schema for schema plugin ", schemaPath);
                console.log(e);
            }
        } else {
            console.log("Schema not found ", join(this.pluginDir, "schema.json"));
        }
    }

    public updateUris(data: any) {
        const clone = data;
        /* TODO: Set absolute uris
         if (data && data.hasOwnProperty('id') && this.elementKeyMap[data.id]) {
         data.uri = 'http://localhost:3000/' + this.name + '/' + this.elementKeyMap[data.id].resource + '/' + data.id;
         }
         */
        for (let i in clone) {
            if (typeof clone[i] === "object") {
                if (clone[i] && clone[i].hasOwnProperty("id")) {
                    this.updateUris(clone[i]);
                } else if (Array.isArray(clone[i])) {
                    for (let y = 0; y < clone[i].length; y++) {
                        if (clone[i][y].hasOwnProperty("id")) {
                            this.updateUris(clone[i][y]);
                        }
                    }
                }

            }
        }
    }

}

class SchemaResource extends Resource {
    private _elements: Array<BehaviorSubject<any>> = [];

    constructor(private service: Service, public name: string, rawElements: any[], private spec?: any) {
        super();
        this._change = new BehaviorSubject(null);
        this._elements = rawElements.map((x: any) => {
            return new BehaviorSubject<any>({
                lastUpdate: Date.now(),
                propertiesChanged: [],
                data: x,
            });
        });

        this._change.next({ lastUpdate: Date.now(), action: "add" });
    }

    get elementSubscribable(): Boolean {
        return true;
    }

    get resourceSubscribable(): Boolean {
        return true;
    }

    public async getElement(elementId: string): Promise<ElementResponse> {
        return {
            status: "ok",
            data: this._elements.find((element: BehaviorSubject<any>) => {
                return (element.getValue().data as { id: string }).id === elementId;
            })
        };
    }

    public async getResource(offset?: string | number, limit?: string | number): Promise<CollectionResponse> {
        let resp: Array<BehaviorSubject<any>>;

        let o: number = 0;
        let l: number = this._elements.length;

        if (offset && typeof offset === "number") {
            o = offset;
        } else if (offset && typeof offset === "string") {
            const el: any = this._elements.find((x) => x.getValue().data.id === offset);
            if (el) {
                o = this._elements.indexOf(el);
            }
        }

        if (limit && typeof limit === "number") {
            l = o + limit;
        } else if (limit && typeof limit === "string") {
            const el: any = this._elements.find((x) => x.getValue().data.id === limit);
            if (el) {
                l = this._elements.indexOf(el) + 1;
            }
        }

        resp = this._elements.slice(o, l);

        return { status: "ok", data: resp };

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
            lastUpdate: Date.now(),
            propertiesChanged: [],
            data: newData,
        });
        this._change.next({ lastUpdate: Date.now(), action: "update", oldValue: collection.data, newValue: newData });
        return { status: "ok" };
    }

    public async createElement(state: any): Promise<ElementResponse> {
        if (!state.name) { return {
            status: "error",
            error: new Error("providing a name is mandatory"),
            code: StatusCode.INTERNAL_SERVER_ERROR
        };
        }

        if (!state.id) {
            state.id = uuid.v1();
        }
        state.uri = "/" + this.service.name.toLowerCase() + "/" + this.name.toLowerCase() + "/" + state.id;

        const newElement: BehaviorSubject<any> = new BehaviorSubject<any>({
            lastUpdate: Date.now(),
            propertiesChanged: [],
            data: state,
        });

        this._elements.push(newElement);
        this._change.next({ lastUpdate: Date.now(), action: "add" });
        return { status: "ok", data: newElement };
    }

    public async deleteElement(elementId: string): Promise<ElementResponse> {
        const idx = this._elements.findIndex((element: BehaviorSubject<any>, index: number) => {
            return (element.getValue().data as { id: string }).id === elementId;
        });

        if (-1 !== idx) {
            this._elements.splice(idx, 1); //remove one item from the collections array
            this._change.next({ lastUpdate: Date.now(), action: "remove" });

            return { status: "ok" };
        }

        return { status: "error", code: 404, message: "Element can not be found" };
    }

}
