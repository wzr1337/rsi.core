export declare abstract class Xobject {
    readonly id: string;
    name: string;
    /**
     * @constructor with default values
     * @param uuid {string} use id or if left empty an v4 uuid is auto generated
     * @param name {string} use name of if left empty an empty string is created
     */
    constructor(uuid?: string, name?: string);
}
