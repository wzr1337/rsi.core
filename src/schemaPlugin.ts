import fs = require("fs");
import { existsSync, readFileSync } from "fs";
import path = require("path");
import { join } from "path";
import { BehaviorSubject } from "rxjs";
import * as uuid from "uuid";
import { CollectionResponse, ElementResponse, IResourceUpdate, Resource, SchemaResource,
  Service, StatusCode } from "./";

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
          if (content.resources.hasOwnProperty(resourceDef)) {
            const data: any = this.data[resourceDef] || [];

            if (Array.isArray(this.data[resourceDef])) {
              this.data[resourceDef].forEach((x: any) => {
                this.elementKeyMap[x.id] = {
                  element: x,
                  resource: resourceDef
                };
              });
            }
          }
        }

        for (const resourceDef in content.resources) {
          if (content.resources.hasOwnProperty(resourceDef)) {
            const data: any = this.data[resourceDef] || [];
            this.updateUris(data);
            // tslint:disable-next-line:max-line-length
            const resource: SchemaResource = new SchemaResource(this, resourceDef, data, content.resources[resourceDef]);
            this.resourceMap[resourceDef] = resource;
            resource.change.subscribe(async () => {
              const collectionResponse: CollectionResponse = await resource.getResource();
              const rawData = collectionResponse.data.map((value: BehaviorSubject < any > ) => {
                return value.getValue().data;
              });
              this.data[resource.name] = rawData;
              let srcPath = path.join(this.pluginDir, "data.json");
              srcPath = srcPath.replace("bin", "src");
              try {
                fs.writeFileSync(srcPath, JSON.stringify(this.data, null, 4), {
                  encoding: "utf-8"
                }); // persist data also to src path otherwise it will be lost with each rebuild
              } catch (d) {
                console.log("Error writing data file src ", d);
              }
              try {
                fs.writeFileSync(path.join(__dirname, this.name, "data.json"), JSON.stringify(this.data, null, 4), {
                  encoding: "utf-8"
                });

              } catch (e) {
                // console.log("Error writing data file bin");
              }

            });
            this.resources.push(resource);
          }
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
    for (const i in clone) {
      if (typeof clone[i] === "object") {
        if (clone[i] && clone[i].hasOwnProperty("id")) {
          this.updateUris(clone[i]);
        } else if (Array.isArray(clone[i])) {

          for (const iterator of clone[i]) {
            if (iterator.hasOwnProperty("id")) {
              this.updateUris(iterator);
            }
          }
        }
      }
    }
  }
}
