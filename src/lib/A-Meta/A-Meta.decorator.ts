import { A_TYPES__Ctor } from "@adaas/a-concept/types";
import { A_Context } from "@adaas/a-concept/a-context";
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
    constructor: A_TYPES__Ctor<T>
) {
    return function <TTarget extends A_TYPES__MetaLinkedComponentConstructors>(
        target: TTarget
    ): TTarget {
        // Store meta info on the target class itself for the Meta decorator to pick up
        A_Context.setMeta(target, new constructor());

        return target;
    };
}