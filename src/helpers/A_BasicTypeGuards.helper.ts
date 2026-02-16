/**
 * Basic TypeGuards that don't create circular dependencies
 * These are used by A_Error and other core classes
 */
export class A_BasicTypeGuards {

    /**
     * Check if value is a string
     * 
     * @param value 
     * @returns 
     */
    static isString(value: any): value is string {
        return typeof value === 'string' || value instanceof String;
    }

    /**
     * Check if value is a number
     * 
     * @param value 
     * @returns 
     */
    static isNumber(value: any): value is number {
        return typeof value === 'number' && isFinite(value);
    }

    /**
     * Check if value is a boolean
     * 
     * @param value 
     * @returns 
     */
    static isBoolean(value: any): value is boolean {
        return typeof value === 'boolean';
    }

    /**
     * Check if value is an object
     * 
     * @param value 
     * @returns 
     */
    static isObject<T = object>(value: any): value is T {
        return value !== null && typeof value === 'object' && !Array.isArray(value);
    }

    /**
     * Check if value is an array
     * 
     * @param value 
     * @returns 
     */
    static isArray(value: any): value is any[] {
        return Array.isArray(value);
    }

    /**
     * Allows to check if the provided param is of constructor type.
     * 
     * @param param 
     * @returns 
     */
    static isErrorConstructorType<T = any>(param: any): param is T {
        return !!param && A_BasicTypeGuards.isObject(param) && !(param instanceof Error) && "title" in param;
    }

    static isErrorSerializedType<T = any>(param: any): param is T {
        return !!param && A_BasicTypeGuards.isObject(param) && !(param instanceof Error) && "aseid" in param && A_BasicTypeGuards.isString((param as any).aseid);
    }

    /**
     * Check if scope is of type A_Scope instance
     * 
     * @param scope 
     * @returns 
     */
    static isScopeInstance(scope: any): boolean {
        // Basic check without importing A_Scope to avoid circular dependency
        return !!scope && typeof scope === 'object' && 'name' in scope && 'aseid' in scope;
    }
}