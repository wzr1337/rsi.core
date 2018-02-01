import fs = require('fs');
import path = require('path');
import { BehaviorSubject } from 'rxjs';
import { Service, Resource, ResourceUpdate, CollectionResponse, ElementResponse, StatusCode } from './rsiPlugin';
import * as uuid from 'uuid';
import { join } from 'path';
import { existsSync, readFileSync } from 'fs';


export class SchemaPlugin extends Service {

    name: string;
    elements: Array<any> = [];
    elementKeyMap: any = {};
    model: any = {};
    schema: any = {};
    data: any = {};
    resourceMap: any = {};

    pluginDir: string;

    constructor() {
        super();

    }

    public init() {
        this.readData();
        this.readSchema();
        this.onReady();
    }

    onReady() {

    }

    readData() {
        if (existsSync(join(this.pluginDir, 'data.json'))) {
            const dataPath: string = join(this.pluginDir, 'data.json');
            var d: string = <string>fs.readFileSync(dataPath, 'utf-8');
            try {
                this.data = JSON.parse(d);
            } catch (e) {
                console.log('Error parsing data for schema plugin ', this.name);
            }
        } else {
            console.log('DATA NOT FOUND ', join(this.pluginDir, 'data.json'));
        }
    }

    readSchema() {
        const schemaPath: string = join(this.pluginDir, 'schema.json');

        if (existsSync(schemaPath)) {

            var d: string = <string>readFileSync(schemaPath, 'utf-8');
            try {
                let content = JSON.parse(d);


                this.setSpecification(content);

                for (var resourceDef in content.resources) {
                    let data: any = this.data[resourceDef] || [];

                    if (Array.isArray(this.data[resourceDef])) {
                        this.data[resourceDef].forEach((x: any) => {
                            this.elementKeyMap[x.id] = {
                                resource: resourceDef,
                                element: x
                            };
                        });
                    }
                }

                for (var resourceDef in content.resources) {
                    let data: any = this.data[resourceDef] || [];
                    this.updateUris(data);
                    let resource: SchemaResource = new SchemaResource(this, resourceDef, data, content.resources[resourceDef]);
                    this.resourceMap[resourceDef] = resource;
                    resource.change.subscribe(() => {
                        const rawData = resource.getResource().data.map((value: BehaviorSubject<any>) => {
                            return value.getValue().data;
                        });
                        this.data[resource.name] = rawData;
                        let srcPath = path.join(this.pluginDir, 'data.json');
                        srcPath = srcPath.replace('bin', 'src');
                        try {
                            fs.writeFileSync(srcPath, JSON.stringify(this.data, null, 4), { encoding: 'utf-8' }); // persist data also to src path otherwise it will be lost with each rebuild
                        } catch (d) {
                            console.log('Error writing data file src ', d);
                        }
                        try {
                            fs.writeFileSync(path.join(__dirname, this.name, 'data.json'), JSON.stringify(this.data, null, 4), { encoding: 'utf-8' });

                        } catch (e) {
                            //console.log("Error writing data file bin");
                        }

                    });
                    this.resources.push(resource);
                }
            } catch (e) {
                console.log('Error Reading schema for schema plugin ', schemaPath);
                console.log(e);
            }
        } else {
            console.log('Schema not found ', join(this.pluginDir, 'schema.json'));
        }
    }


    updateUris(data: any) {
        let clone = data;
        /* TODO: Set absolute uris
         if (data && data.hasOwnProperty('id') && this.elementKeyMap[data.id]) {
         data.uri = 'http://localhost:3000/' + this.name + '/' + this.elementKeyMap[data.id].resource + '/' + data.id;
         }
         */
        for (var i in clone) {
            if (typeof clone[i] === 'object') {
                if (clone[i] && clone[i].hasOwnProperty('id')) {
                    this.updateUris(clone[i]);
                } else if (Array.isArray(clone[i])) {
                    for (var y = 0; y < clone[i].length; y++) {
                        if (clone[i][y].hasOwnProperty('id')) {
                            this.updateUris(clone[i][y]);
                        }
                    }
                }

            }
        }
    }

}


class SchemaResource implements Resource {
    private _elements: BehaviorSubject<any>[] = [];
    private _change: BehaviorSubject<ResourceUpdate> = new BehaviorSubject(null);

    constructor(private service: Service, public name: string, rawElements: Array<any>, private spec?: any) {
        this._elements = rawElements.map((x: any) => {
            return new BehaviorSubject<any>({
                lastUpdate: Date.now(),
                propertiesChanged: [],
                data: x
            });
        });


        this._change.next({ lastUpdate: Date.now(), action: 'add' });
    }

    get elementSubscribable(): Boolean {
        return true;
    };

    get resourceSubscribable(): Boolean {
        return true;
    };

    get change(): BehaviorSubject<ResourceUpdate> {
        return this._change;
    }

    getElement(elementId: string): ElementResponse {
        return {
            status: 'ok',
            data: this._elements.find((element: BehaviorSubject<any>) => {
                return (<{ id: string }>element.getValue().data).id === elementId;
            })
        };
    };

    getResource(offset?: string | number, limit?: string | number): CollectionResponse {
        let resp: BehaviorSubject<any>[];

        let o: number = 0;
        let l: number = this._elements.length;

        if (offset && typeof offset === 'number') {
            o = offset;
        } else if (offset && typeof offset === 'string') {
            let el: any = this._elements.find((x) => x.getValue().data.id === offset);
            if (el) {
                o = this._elements.indexOf(el);
            }
        }

        if (limit && typeof limit === 'number') {
            l = o + limit;
        } else if (limit && typeof limit === 'string') {
            let el: any = this._elements.find((x) => x.getValue().data.id === limit);
            if (el) {
                l = this._elements.indexOf(el) + 1;
            }
        }

        resp = this._elements.slice(o, l);

        return { status: 'ok', data: resp };

    };

    getResourceSpec() {
        return this.spec;
    }

    updateElement(elementId: string, difference: any): ElementResponse {
        let element = this.getElement(elementId).data;
        var collection: any = element.getValue();

        let newData = Object.assign({}, collection.data, difference);

        element.next({
            lastUpdate: Date.now(),
            propertiesChanged: [],
            data: newData
        });
        this._change.next({ lastUpdate: Date.now(), action: 'update', oldValue: collection.data, newValue: newData });
        return { status: 'ok' };
    }


    createElement(state: any): ElementResponse {
        if (!state.name) return {
            status: 'error',
            error: new Error('providing a name is mandatory'),
            code: StatusCode.INTERNAL_SERVER_ERROR
        };

        if (!state.id) {
            state.id = uuid.v1();
        }
        state.uri = '/' + this.service.name.toLowerCase() + '/' + this.name.toLowerCase() + '/' + state.id;


        let newElement: BehaviorSubject<any> = new BehaviorSubject<any>({
            lastUpdate: Date.now(),
            propertiesChanged: [],
            data: state
        });

        this._elements.push(newElement);
        this._change.next({ lastUpdate: Date.now(), action: 'add' });
        return { status: 'ok', data: newElement };
    };


    deleteElement(elementId: string): ElementResponse {
        let idx = this._elements.findIndex((element: BehaviorSubject<any>, index: number) => {
            return (<{ id: string }>element.getValue().data).id === elementId;
        });

        if (-1 !== idx) {
            this._elements.splice(idx, 1); //remove one item from the collections array
            this._change.next({ lastUpdate: Date.now(), action: 'remove' });

            return { status: 'ok' };
        }

        return { status: 'error', code: 404, message: 'Element can not be found' };
    }


}
