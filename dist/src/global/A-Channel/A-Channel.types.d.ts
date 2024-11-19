import { A_Component } from "../A-Component/A-Component.class";
import { A_Fragment } from "../A-Fragment/A-Fragment.class";
export type A_TYPES__A_DependencyReferenceConstructor = {
    /**
     * The name of the dependency
     */
    name: string;
    /**
     * The version of the module
     * By default it is 1.0.0
     */
    version: string;
};
export type A_TYPES__A_DependencyReferenceConstructorConfig = {
    /**
     * Sync  - blocks A-Express Application initialization until module is ready
     * Async - allows to initialize module after A-Express Application initialization
     */
    behavior: 'async' | 'sync';
    /**
     * Allows to define a scheme of retries
     */
    retries: {
        /**
         * The number of retries
         * Default is 3
         */
        n: number;
        /**
         * The timeout between retries
         * Multiplied by the number of retries
         * So after each retry the timeout is increased e.g. 1000ms * 1, 1000ms * 2, 1000ms * 3
         * Default is 1000
         */
        timeout: number;
    };
};
export type A_TYPES__A_ChannelCallParams = {
    fragments: Array<A_Fragment>;
    components: Array<typeof A_Component>;
};
/**
 * Returns a string set of possible methods that could be called on a provided A-Component
 */
export type A_TYPES__A_ExecutableMethods<T> = {
    [K in keyof T]: T[K] extends (...arg: Partial<A_TYPES__A_ChannelCallParams>[]) => Promise<any> ? K : never;
}[keyof T];
/**
 * Returns a string set of possible methods that could be called on a set of provided set of A-Components
 */
export type A_TYPES__A_ChannelAggregateMethods<TClasses extends A_Component[]> = {
    [K in keyof TClasses]: TClasses[K] extends infer Instance ? A_TYPES__A_ExecutableMethods<Instance> : never;
}[number];
/**
 * Describes a type of proxy object and consists of all callable methods from a set opf provided components
 */
export type A_TYPES__A_ChannelAggregated<TClasses extends any[]> = {
    [Method in A_TYPES__A_ChannelAggregateMethods<TClasses>]: {
        [Class in keyof TClasses]: TClasses[Class] extends infer Instance ? Method extends keyof Instance ? (params: Partial<A_TYPES__A_ChannelCallParams>) => Promise<any> : never : never;
    }[number];
};
/**
 * A set of parameters are required to construct a new A-Channel
 */
export type A_TYPES__A_ChannelConstructor = {
    id: string;
};
