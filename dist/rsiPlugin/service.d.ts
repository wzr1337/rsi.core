import { Resource } from "../";
/**
 * The general service class
 *
 * @export
 * @class Service
 */
export declare class Service {
    id: string;
    protected knownResources: Resource[];
    protected specification: string;
    /**
     * Retrieve the service name including casing
     *
     * @readonly
     * @type {string}
     * @memberof Service
     */
    readonly name: string;
    /**
     * Get a list of resources providesd by the service
     *
     * @readonly
     * @type {Resource[]} the rescoures provided by the service
     * @memberof Service
     */
    readonly resources: Resource[];
    /**
     * Get a dedicates of resource by name
     *
     * @param {string} name the resource name
     * @returns {Resource}
     * @memberof Service
     */
    getResource(name: string): Resource;
    getSpecification(): string;
    setSpecification(spec: string): void;
    /**
     * Add a resource to the list of known resources
     *
     * @param {Resource} resource the resource itself
     * @memberof Service
     */
    addResource(resource: Resource): void;
}
