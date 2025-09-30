import { A_Fragment } from "@adaas/a-concept/global/A-Fragment/A-Fragment.class";
import { A_Error } from "@adaas/a-utils";


export class A_CommandContext<
    T extends Record<string, any> = Record<string, any>
> extends A_Fragment {


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
    constructor(initialValues: T = {} as T) {
        super();
        this._memory = new Map(Object.entries(initialValues));
        this._errors = new Set();
    }


    get Errors(): Set<A_Error> | undefined {
        return this._errors.size > 0 ? this._errors : undefined;
    }


    /**
     * Verifies that all required keys are present in the proxy values
     * 
     * @param requiredKeys 
     * @returns 
     */
    verifyPrerequisites(
        requiredKeys: Array<keyof T>
    ): boolean {
        return requiredKeys.every(key => this._memory.has(key));
    }

    /**
     * Adds an error to the context
     * 
     * @param error 
     */
    error(error: A_Error): void {
        this._errors.add(error);
    }

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
        value: T[K]
    ): void {
        this._memory.set(key, value);
    }


    /**
     * Removes a value from the context memory by key
     * 
     * @param key 
     */
    drop(key: keyof T): void {
        this._memory.delete(key);
    }

    /**
     * Clears all stored values in the context memory
     */
    clear(): void {
        this._memory.clear();
    }


    /**
     * Converts all stored values to a plain object
     * 
     * [!] By default uses all saved in memory values 
     * 
     * @returns 
     */
    toJSON(): Record<string, any> {
        const obj: Record<string, any> = {};

        this._memory.forEach((value, key) => {
            obj[key as string] =
                typeof value === 'object' && value !== null && 'toJSON' in value && typeof value.toJSON === 'function'
                    ? value.toJSON()
                    : value;
        })

        return obj;
    }
}