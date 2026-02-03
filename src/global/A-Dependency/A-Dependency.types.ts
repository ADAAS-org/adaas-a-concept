//  ==================================== A-Dependency types ====================================  //

import { A_TYPES__Ctor } from "@adaas/a-concept/types/A_Common.types";
import { A_Caller } from "../A-Caller/A_Caller.class";
import { A_Component } from "../A-Component/A-Component.class";
import { A_Container } from "../A-Container/A-Container.class";
import { A_Entity } from "../A-Entity/A-Entity.class"
import { A_Error } from "../A-Error/A_Error.class";
import { A_Feature } from "../A-Feature/A-Feature.class";
import { A_Fragment } from "../A-Fragment/A-Fragment.class";
import { A_Dependency } from "./A-Dependency.class";
import { A_Scope } from "../A-Scope/A-Scope.class";


// ===========================================================================================
// ============================= A-Dependency Resolution Options =============================
// ===========================================================================================
export type A_TYPES__A_DependencyConstructor<T extends A_Dependency> = A_TYPES__Ctor<T>;

export type A_TYPES__A_DependencyInjectable = A_Entity
    | A_Container
    | A_Component
    | A_Fragment
    | A_Feature
    | A_Caller
    | A_Error
    | A_Scope


export type A_TYPES__A_DependencyResolutionType<T> =
    T extends string
    ? string
    : T extends A_TYPES__Ctor<infer R>
    ? R
    : never


export type A_TYPES__A_DependencyResolutionStrategy<T extends A_TYPES__A_DependencyInjectable = A_TYPES__A_DependencyInjectable> = {
    /**
     * If tru will throw an error if the dependency is not found
     */
    require: boolean
    /**
     * Indicates that dependency should be loaded from a specific path before resolution
     */
    load: boolean
    /**
     * Number of levels to go up in the parent chain when resolving the dependency
     */
    parent: number
    /**
     * If true, will only resolve the dependency in the current scope without going up to parent scopes
     */
    flat: boolean
    /**
     * If has any value indicates that entity should be created with default parameters provided 
     */
    create: boolean
    /**
     * Default constructor arguments to use when creating the dependency
     */
    args: any[]

    /**
     * Allows to query by specific entity properties e.g. ASEID, name, type, custom properties, etc.
     */
    query: Partial<A_TYPES__A_Dependency_EntityInjectionQuery<T>>,
    /**
     * Pagination settings for the entity search
     */
    pagination: A_TYPES__A_Dependency_EntityInjectionPagination
}


export type A_TYPES__A_Dependency_Serialized<T extends A_TYPES__A_DependencyInjectable = A_TYPES__A_DependencyInjectable> = {
    name: string,
    all: boolean,
    require: boolean,
    load: boolean,
    parent: number,
    flat: boolean,
    create: any,
    args: any[],
    query: Partial<A_TYPES__A_Dependency_EntityInjectionQuery<T>>,
    pagination: A_TYPES__A_Dependency_EntityInjectionPagination
}

// =--------------------------------------------------------------------------------------------
// =========================== A-Dependency Possible Configurations ============================
// =--------------------------------------------------------------------------------------------


export type A_TYPES__A_Dependency_EntityResolutionConfig<T extends A_TYPES__A_DependencyInjectable = A_TYPES__A_DependencyInjectable> = {
    query: Partial<A_TYPES__A_Dependency_EntityInjectionQuery<T>>,
    pagination: Partial<A_TYPES__A_Dependency_EntityInjectionPagination>
}


export type A_TYPES__A_Dependency_EntityInjectionQuery<T extends A_TYPES__A_DependencyInjectable = A_TYPES__A_DependencyInjectable> =
    T extends A_Entity
    ? {
        aseid: string,
    } & {
        [key in keyof T]?: any
    }
    : never;


export type A_TYPES__A_Dependency_EntityInjectionPagination = {
    count: number,
    from: 'start' | 'end'
}


/**
 * A-Dependency require decorator return type 
 */
export type A_TYPES__A_Dependency_RequireDecoratorReturn<T = any> = (
    target: T,
    propertyKey: string | symbol | undefined,
    parameterIndex: number
) => void

/**
 * A-Dependency load decorator return type 
 */
export type A_TYPES__A_Dependency_LoadDecoratorReturn<T = any> = (
    target: T,
    propertyKey: string | symbol | undefined,
    parameterIndex: number
) => void

/**
 * A-Dependency default decorator return type
 */
export type A_TYPES__A_Dependency_DefaultDecoratorReturn<T = any> = (
    target: T,
    propertyKey: string | symbol | undefined,
    parameterIndex: number
) => void

/**
 * A-Dependency parent decorator return type
 */
export type A_TYPES__A_Dependency_ParentDecoratorReturn<T = any> = (
    target: T,
    propertyKey: string | symbol | undefined,
    parameterIndex: number
) => void
/**
 * A-Dependency flat decorator return type
 */
export type A_TYPES__A_Dependency_FlatDecoratorReturn<T = any> = (
    target: T,
    propertyKey: string | symbol | undefined,
    parameterIndex: number
) => void
/**
 * A-Dependency All decorator return type
 */
export type A_TYPES__A_Dependency_AllDecoratorReturn<T = any> = (
    target: T,
    propertyKey: string | symbol | undefined,
    parameterIndex: number
) => void
