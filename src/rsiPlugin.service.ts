import { Resource } from "./";

/**
 * The general service class
 *
 * @export
 * @class Service
 */
export class Service {

  public id: string = "no id set";
  protected knownResources: Resource[] = [];
  protected specification: string = "";

  /**
   * Retrieve the service name including casing
   *
   * @readonly
   * @type {string}
   * @memberof Service
   */
  get name(): string {
    return this.constructor.name;
  }

  /**
   * Get a list of resources providesd by the service
   *
   * @readonly
   * @type {Resource[]} the rescoures provided by the service
   * @memberof Service
   */
  get resources(): Resource[] {
    return this.knownResources;
  }

  /**
   * Get a dedicates of resource by name
   *
   * @param {string} name the resource name
   * @returns {Resource}
   * @memberof Service
   */
  public getResource(name: string): Resource {
    return this.resources.find((r: Resource) => r.name === name);
  }

  public getSpecification(): string {
    return this.specification;
  }

  public setSpecification(spec: string) {
    this.specification = spec;
  }

  /**
   * Add a resource to the list of known resources
   *
   * @param {Resource} resource the resource itself
   * @memberof Service
   */
  protected addResource(resource: Resource): void {
    this.resources.push(resource);
  }
}
