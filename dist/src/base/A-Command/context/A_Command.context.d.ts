import { A_Fragment } from "../../../global/A-Fragment/A-Fragment.class";
import { A_Error } from "@adaas/a-utils";
export declare class A_CommandContext<T extends Record<string, any> = Record<string, any>> extends A_Fragment {
    /**
     * Internal storage of all intermediate values
     */
    protected _memory: Map<keyof T, T[keyof T]>;
    /**
     * Errors encountered during the execution
     */
    protected _errors: Set<A_Error>;
    /**
     * ExecutionContext for the A-Command
     *
     */
    constructor(initialValues?: T);
    get Errors(): Set<A_Error> | undefined;
    /**
     * Verifies that all required keys are present in the proxy values
     *
     * @param requiredKeys
     * @returns
     */
    verifyPrerequisites(requiredKeys: Array<keyof T>): boolean;
    /**
     * Adds an error to the context
     *
     * @param error
     */
    error(error: A_Error): void;
    /**
     * Saves a value in the context memory
     *
     * @param key
     * @param value
     */
    save<K extends keyof T>(
    /**
     * Key to save the value under
     */
    key: K, 
    /**
     * Value to save
     */
    value: T[K]): void;
    /**
     * Removes a value from the context memory by key
     *
     * @param key
     */
    drop(key: keyof T): void;
    /**
     * Clears all stored values in the context memory
     */
    clear(): void;
    /**
     * Converts all stored values to a plain object
     *
     * [!] By default uses all saved in memory values
     *
     * @returns
     */
    toJSON(): Record<string, any>;
}
