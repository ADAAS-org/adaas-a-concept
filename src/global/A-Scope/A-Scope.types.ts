import { A_Component } from "../A-Component/A-Component.class"
import { A_TYPES__Component_Constructor } from "../A-Component/A-Component.types"
import { A_Container } from "../A-Container/A-Container.class"
import { A_Entity } from "../A-Entity/A-Entity.class"
import { A_TYPES__Entity_Constructor } from "../A-Entity/A-Entity.types"
import { A_Feature } from "../A-Feature/A-Feature.class"
import { A_Fragment } from "../A-Fragment/A-Fragment.class"
import { A_Caller } from "../A-Caller/A_Caller.class"
import { A_Error } from "../A-Error/A_Error.class"
import { A_TYPES__Error_Constructor } from "../A-Error/A_Error.types"
import { A_Scope } from "./A-Scope.class"
import { A_TYPES__Container_Constructor } from "../A-Container/A-Container.types"
import { A_TYPES__Feature_Constructor } from "../A-Feature/A-Feature.types"


// ============================================================================
// --------------------------- Primary Types ----------------------------------
// ============================================================================
/**
 * Scope constructor type
 * Uses the generic type T to specify the type of the Scope
 */
export type A_TYPES__Scope_Constructor<T = A_Scope> = new (...args: any[]) => T;
/**
 * Scope initialization type
 */
export type A_TYPES__Scope_Init<
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
 * 
 */
export type A_TYPES__ScopeLinkedConstructors = A_TYPES__Container_Constructor | A_TYPES__Feature_Constructor;
/**
 * A list of components that can have a scope associated with them
 */
export type A_TYPES__ScopeLinkedComponents = A_Container | A_Feature;
/**
 * A list of components that can be resolved by a scope
 */
export type A_TYPES__ScopeResolvableComponents = A_Component | A_Fragment | A_Entity | A_Error | A_Scope;
/**
 * A list of components that are dependent on a scope and do not have their own scope
 */
export type A_TYPES_ScopeDependentComponents = A_Component | A_Entity | A_Fragment | A_Error;
/**
 * A list of components that are independent of a scope. They don't need a scope to be resolved
 * Those components haven't scope dependent features.
 */
export type A_TYPES_ScopeIndependentComponents = A_Error | A_Scope | A_Caller

