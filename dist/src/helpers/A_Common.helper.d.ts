import { A_TYPES__DeepPartial } from "../types/A_Common.types";
export declare class A_CommonHelper {
    /**
     * A simple promise that resolves immediately.
     * Can be used in async functions to create a resolved promise.
     */
    static resolve(): Promise<void>;
    /**
     * Check if a class is inherited from another class
     *
     * @param childClass
     * @param parentClass
     * @returns
     */
    static isInheritedFrom(childClass: any, parentClass: any): boolean;
    /**
     *  Omit properties from an object or array with nested objects
     *
     * @param input
     * @param paths
     * @returns
     */
    static omitProperties<T, S extends string>(input: T, paths: string[]): Omit<T, S>;
    static isObject(item: unknown): item is Record<string, any>;
    static deepMerge<T = any>(target: any, source: any, visited?: Map<any, any>): T;
    static deepClone<T>(target: T): T;
    static deepCloneAndMerge<T>(target: A_TYPES__DeepPartial<T>, source: T): T;
}
