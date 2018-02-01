import { Service } from './rsiPlugin';
export declare class SchemaPlugin extends Service {
    name: string;
    elements: Array<any>;
    elementKeyMap: any;
    model: any;
    schema: any;
    data: any;
    resourceMap: any;
    pluginDir: string;
    constructor();
    init(): void;
    onReady(): void;
    readData(): void;
    readSchema(): void;
    updateUris(data: any): void;
}
