import { v4 } from "uuid";

export abstract class XObject {

  /**
   * @constructor with default values
   * @param id {string} use id or if left empty an v4 uuid is auto generated
   * @param name {string} use name of if left empty an empty string is created
   */
  constructor(public readonly id: string = v4(), public name: string = "") {
  }
}
