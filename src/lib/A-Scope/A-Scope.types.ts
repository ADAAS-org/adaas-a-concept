import type {
    A_Component,
    A_TYPES__Component_Constructor
} from "@adaas/a-concept/a-component"
import type {
    A_Container,
    A_TYPES__Container_Constructor
} from "@adaas/a-concept/a-container"
import type {
    A_Entity,
    A_TYPES__Entity_Constructor
} from "@adaas/a-concept/a-entity"
import type { A_Feature } from "@adaas/a-concept/a-feature"
import type { A_Fragment } from "@adaas/a-concept/a-fragment"
import type { A_Caller } from "@adaas/a-concept/a-caller"
import type {
    A_Error,
    A_TYPES__Error_Constructor
} from "@adaas/a-concept/a-error"
import type { A_Scope } from "./A-Scope.class"
import type { A_TYPES__Feature_Constructor } from "@adaas/a-concept/a-feature"
import type { A_TYPES__Ctor } from "@adaas/a-concept/types"


// ============================================================================
// --------------------------- Primary Types ----------------------------------
// ============================================================================
/**
 * Scope constructor type
 * Uses the generic type T to specify the type of the Scope
 */
export type A_TYPES__Scope_Constructor<T = A_Scope> = A_TYPES__Ctor<T>;
/**
 * Scope initialization type
 */
export type A_TYPES__Scope_Init<
    _MetaItems extends Record<string, any> = any,
    _ComponentType extends A_TYPES__Component_Constructor[] = A_TYPES__Component_Constructor[],
    _ErrorType extends A_TYPES__Error_Constructor[] = A_TYPES__Error_Constructor[],
    _EntityType extends A_TYPES__Entity_Constructor[] = A_TYPES__Entity_Constructor[],
    _FragmentType extends A_Fragment[] = A_Fragment[],
> = {
    /**
     * Scope Name
     */
    name: string,
    /**
     * A list of Context Fragments available in the Scope
     */
    fragments: [..._FragmentType];
    /**
     * A set of Components available in the Scope
     */
    components: [..._ComponentType],
    /**
     * A set of Errors available in the Scope
     */
    errors: [..._ErrorType],
    /**
     * A set of Entities available in the Scope
     *  
     */
    entities: [
        ..._EntityType,
        ...InstanceType<_EntityType[number]>[]
    ];

    meta: Partial<_MetaItems>;
};
/**
 * Scope configuration type
 */
export type A_TYPES__ScopeConfig = {
    /**
     * Allows to define a parent to take dependencies from in case of the current scope does not have the required component
     */
    parent: A_Scope
}
/**
 * Scope serialized type
 */
export type A_TYPES__Scope_Serialized = {}


/**
 * A list of constructors that can have a scope associated with them
 */
export type A_TYPES__ScopeLinkedConstructors = A_TYPES__Container_Constructor | A_TYPES__Feature_Constructor;
/**
 * A list of components that can have a scope associated with them
 */
export type A_TYPES__ScopeLinkedComponents = A_Container | A_Feature | A_Entity
/**
 * A list of components that are dependent on a scope and do not have their own scope
 */
export type A_TYPES_ScopeDependentComponents = A_Component | A_Entity | A_Fragment | A_Error;
/**
 * A list of components that are independent of a scope. They don't need a scope to be resolved
 * Those components haven't scope dependent features.
 */
export type A_TYPES_ScopeIndependentComponents = A_Error | A_Scope | A_Caller