import { A_Context } from "../A-Context/A-Context.class";
import { A_Meta } from "./A-Meta.class";
import { A_TYPES__MetaLinkedComponentConstructors } from "./A-Meta.types";




/**
 * 
 * This decorator should allow to set a default meta type for the class, this helps to avoid
 * the need to create custom meta classes for each class.
 * 
 * @returns 
 */
export function A_MetaDecorator<T extends A_Meta>(
    constructor: new (...args: any[]) => T
) {
    return function (target: A_TYPES__MetaLinkedComponentConstructors
    ) {
        // Store meta info on the target class itself for the Meta decorator to pick up
        A_Context.setMeta(target, new constructor());

        return target;
    };
}