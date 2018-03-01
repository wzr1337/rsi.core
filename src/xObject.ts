import { v4 } from "uuid";

export abstract class Xobject {
  public readonly id: string;
  public name: string;

  /**
   * @constructor with default values
   * @param uuid {string} use id or if left empty an v4 uuid is auto generated
   * @param name {string} use name of if left empty an empty string is created
   */
  constructor(uuid: string = v4(), name: string = "") {
    this.id = uuid;
    this.name = name;
  }
}
