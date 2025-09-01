import { A_Container } from "@adaas/a-concept/global/A-Container/A-Container.class";
import { A_Component } from "../A-Component/A-Component.class"
import { A_TYPES__ContainerCallParams } from "../A-Container/A-Container.types"
import { A_Fragment } from "../A-Fragment/A-Fragment.class"


export type A_TYPES__A_DependencyReferenceConstructor = {
    /**
     * The name of the dependency 
     */
    name: string
    /**
     * The version of the module 
     * By default it is 1.0.0
     */
    version: string
    /**
     * The dependencies of the module 
     * Could be:
     * - other Modules
     * - other Contexts
     * 
     */
    // dependencies: Array<typeof A_Namespace>
    /**
     * The source of the dependency 
     * Could be:
     * - a string representing the path to the module
     * - a module class  (in case when config should be provided via the module constructor)
     * - a module class constructor
     * - a context class (in case when config should be provided via the context constructor)
     * - a context class constructor
     * 
     */
    // source: A_Module | A_Context | typeof A_Module | typeof A_Context | string
    // source: A_Namespace
}


export type A_TYPES__A_DependencyReferenceConstructorConfig = {
    /**
     * Sync  - blocks A-Express Application initialization until module is ready 
     * Async - allows to initialize module after A-Express Application initialization
     */
    behavior: 'async' | 'sync',

    /**
     * Allows to define a scheme of retries
     */
    retries: {
        /**
         * The number of retries
         * Default is 3
         */
        n: number,
        /**
         * The timeout between retries
         * Multiplied by the number of retries 
         * So after each retry the timeout is increased e.g. 1000ms * 1, 1000ms * 2, 1000ms * 3
         * Default is 1000
         */
        timeout: number
    }
}


export type A_TYPES__A_ChannelCallParams = {
    fragments: Array<A_Fragment>,
    components: Array<typeof A_Component>
}


/**
 * Returns a string set of possible methods that could be called on a provided A-Component
 */
export type A_TYPES__A_ExecutableMethods<T> = {
    [K in keyof T]: T[K] extends (...arg: Partial<A_TYPES__A_ChannelCallParams>[]) => Promise<any> ? K : never
}[keyof T];


/**
 * Returns a string set of possible methods that could be called on a set of provided set of A-Components
 */
export type A_TYPES__A_ChannelAggregateMethods<TClasses extends (A_Component | A_Container)[]> = {
    [K in keyof TClasses]: TClasses[K] extends infer Instance
    ? A_TYPES__A_ExecutableMethods<Instance>
    : never;
}[number];


/**
 * Describes a type of proxy object and consists of all callable methods from a set opf provided components 
 */
export type A_TYPES__A_ChannelAggregated<TClasses extends any[]> = {
    [Method in A_TYPES__A_ChannelAggregateMethods<TClasses>]: {
        [Class in keyof TClasses]: TClasses[Class] extends infer Instance
        ? Method extends keyof Instance
        // Just put it here for possible cases with detailed params
        // ? Instance[Method]
        ? (params: Partial<A_TYPES__A_ChannelCallParams>) => Promise<any>
        : never
        : never;
    }[number]; // Select the method signature from any matching class
};




/**
 * A set of parameters are required to construct a new A-Channel
 */
export type A_TYPES__A_ChannelConstructor = {
    id: string,
}