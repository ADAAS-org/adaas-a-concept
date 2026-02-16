import { A_TYPES__DeepPartial } from "@adaas/a-concept/types";

export class A_CommonHelper {

    /**
     * A simple promise that resolves immediately.
     * Can be used in async functions to create a resolved promise.
     */
    static resolve() {
        return new Promise<void>((resolve) => resolve());
    }

    /**
     * Check if a class is inherited from another class
     * 
     * @param childClass 
     * @param parentClass 
     * @returns 
     */
    static isInheritedFrom(childClass: any, parentClass: any): boolean {
        let current = childClass;

        // Traverse the prototype chain
        while (current) {
            if (current === parentClass) {
                return true;
            }
            current = Object.getPrototypeOf(current);
        }
        return false;
    }


    /**
     * Get all parent classes of a given class
     * 
     * @param childClass 
     * @returns 
     */
    static getParentClasses(childClass: any): any[] {

        // first we need to check is that a constructor or instance
        let current = typeof childClass === 'function'
            ? Object.getPrototypeOf(childClass)
            : Object.getPrototypeOf(childClass.constructor);

        const parents = [] as any[];

        // Traverse the prototype chain
        while (current && current !== Function.prototype) {
            parents.push(current);
            current = Object.getPrototypeOf(current);
        }
        return parents;

    }

    /**
     * Get the class inheritance chain as an array of class names
     * 
     * @param childClass 
     * @returns 
     */
    static getClassInheritanceChain(childClass: any): any[] {

        //  first we need to check is that a constructor or instance
        let current = typeof childClass === 'function'
            ? Object.getPrototypeOf(childClass)
            : Object.getPrototypeOf(childClass.constructor);

        //  then if input is instance we have to include its own class name
        const chain = typeof childClass === 'function'
            ? [childClass]
            : [childClass.constructor];


        // Traverse the prototype chain
        while (current && current !== Function.prototype) {
            chain.push(current);
            current = Object.getPrototypeOf(current);
        }
        return chain;
    }

    /**
     * Get the parent class of a given class
     * 
     * @param childClass 
     * @returns 
     */
    static getParentClass(childClass: any): any {
        return Object.getPrototypeOf(childClass);
    }

    /**
     *  Omit properties from an object or array with nested objects
     * 
     * @param input 
     * @param paths 
     * @returns 
     */
    static omitProperties<T, S extends string>(
        input: T,
        paths: string[]

    ): Omit<T, S> {

        // Deep clone the input object or array
        const result = JSON.parse(JSON.stringify(input));

        // Helper function to recursively remove properties
        function removeProperties(target: Record<string, any> | any[], currPath: string[]) {
            const currKey = currPath[0];
            if (currPath.length === 1) {
                // If current path has only one key, delete the property
                delete target[currKey];
            } else if (target[currKey] !== undefined && typeof target[currKey] === 'object') {
                // If current key exists and is an object, recursively call removeProperties
                removeProperties(target[currKey], currPath.slice(1));
            }
        }

        // Iterate through each path and remove corresponding properties from the result
        paths.forEach(path => {
            const pathKeys = path.split('.');
            removeProperties(result, pathKeys);
        });

        return result as Omit<T, S>;
    }


    static isObject(item: unknown): item is Record<string, any> {
        return item !== null && typeof item === 'object' && !Array.isArray(item);
    }

    static deepMerge<T = any>(target: any, source: any, visited = new Map<any, any>()): T {
        if (this.isObject(target) && this.isObject(source)) {
            for (const key in source) {
                if (this.isObject(source[key])) {
                    if (!target[key]) {
                        target[key] = {};
                    }
                    // Check if the source object has already been visited
                    if (!visited.has(source[key])) {
                        visited.set(source[key], {});
                        this.deepMerge(target[key], source[key], visited);
                    } else {
                        target[key] = visited.get(source[key]);
                    }
                } else {
                    target[key] = source[key];
                }
            }
        }
        return target;
    }


    static deepClone<T>(target: T): T {
        // Check if the value is null or undefined
        if (target === null || target === undefined) {
            return target;
        }

        // Handle primitive types (string, number, boolean, etc.)
        if (typeof target !== 'object') {
            return target;
        }

        // Handle Date
        if (target instanceof Date) {
            return new Date(target.getTime()) as T;
        }

        // Handle Array
        if (Array.isArray(target)) {
            return target.map(item => this.deepClone(item)) as unknown as T;
        }

        // Handle Function
        if (typeof target === 'function') {
            return target;
        }

        // Handle Object
        if (target instanceof Object) {
            const clone = {} as T;
            for (const key in target) {
                if (target.hasOwnProperty(key)) {
                    clone[key] = this.deepClone(target[key]);
                }
            }
            return clone;
        }

        // For any other cases
        throw new Error('Unable to clone the object. Unsupported type.');
    }


    static deepCloneAndMerge<T>(target: A_TYPES__DeepPartial<T>, source: T): T {
        if (
            (source === null || source === undefined) &&
            (target === null || target === undefined))
            return target;

        // Check if the value is null or undefined
        if ((target === null || target === undefined) &&
            source
        ) {
            return this.deepClone(source);
        }

        // Handle primitive types (string, number, boolean, etc.)
        if (typeof target !== 'object') {
            return target
        }


        // Handle Date
        if (target instanceof Date) {
            return new Date(target.getTime()) as T;
        }

        // Handle Array
        if (Array.isArray(target)) {
            return target.map(item => this.deepCloneAndMerge(item, source)) as unknown as T;
        }

        // Handle Function
        if (typeof target === 'function') {
            return target;
        }

        // Handle Object
        if (target instanceof Object) {
            const clone = {} as T;
            for (const key in target) {
                if (
                    source[key] !== null
                    &&
                    source[key] !== undefined
                )
                    clone[key] = this.deepCloneAndMerge(target[key as any], source[key]);
                else
                    clone[key as any] = this.deepClone(target[key]);
            }

            for (const key in source) {
                if (
                    target[key] !== undefined
                    &&
                    target[key] !== null
                )
                    clone[key] = this.deepCloneAndMerge(target[key], source[key]);
                else
                    clone[key] = this.deepClone(source[key]);
            }
            return clone;
        }

        // For any other cases
        throw new Error('Unable to clone the object. Unsupported type.');
    }

    /**
     * Get a readable name for a component (string, class, function, React element, instance, etc.)
     *
     * Covers:
     * - string tags ("div")
     * - symbols (Symbol.for('xxx'))
     * - functions and classes (with name or displayName)
     * - React elements (object with `type`)
     * - component instances (constructor.name)
     * - objects with custom toString returning meaningful info
     *
     * Falls back to sensible defaults ("Unknown" / "Anonymous").
     */
    static getComponentName(component: any): string {
        const UNKNOWN = 'Unknown';
        const ANONYMOUS = 'Anonymous';

        if (component === null || component === undefined) {
            return UNKNOWN;
        }

        // Strings (HTML tags or explicit names)
        if (typeof component === 'string') {
            return component || UNKNOWN;
        }

        // Symbols
        if (typeof component === 'symbol') {
            try {
                return component.toString();
            } catch {
                return UNKNOWN;
            }
        }

        // Arrays - try to derive from first element
        if (Array.isArray(component)) {
            if (component.length === 0) return UNKNOWN;
            return this.getComponentName(component[0]);
        }

        // Functions and classes
        if (typeof component === 'function') {
            const fnAny = component as any;
            // Common React convention
            if (fnAny.displayName) return String(fnAny.displayName);
            if (fnAny.name) return String(fnAny.name);

            if (fnAny.constructor && fnAny.constructor.name) {
                return String(fnAny.constructor.name);
            }

            // Try to extract a name from source if possible
            try {
                const src = Function.prototype.toString.call(component);
                // class Foo { ... } or function foo() { ... } or foo => ...
                const match = src.match(/^(?:class\s+([A-Za-z0-9_$]+)|function\s+([A-Za-z0-9_$]+)|([A-Za-z0-9_$]+)\s*=>)/);
                if (match) {
                    return match[1] || match[2] || match[3] || ANONYMOUS;
                }
            } catch {
                // fallthrough
            }
            return ANONYMOUS;
        }

        // Objects (instances, React elements, plain objects)
        if (typeof component === 'object') {
            const objAny = component as any;

            // React element: { type: ComponentOrString, props: ... }
            if (objAny.type) {
                return this.getComponentName(objAny.type);
            }

            // React forwardRef / memo wrappers often expose displayName
            if (objAny.displayName) return String(objAny.displayName);
            if (objAny.name) return String(objAny.name);

            // Instance: use constructor name if available and not Object
            if (objAny.constructor && objAny.constructor.name && objAny.constructor.name !== 'Object') {
                return String(objAny.constructor.name);
            }

            // If object implements a meaningful toString, try it
            try {
                const s = objAny.toString();
                if (typeof s === 'string' && s !== '[object Object]') {
                    return s;
                }
            } catch {
                // ignore
            }

            return ANONYMOUS;
        }

        // Fallback for other types
        try {
            return String(component);
        } catch {
            return UNKNOWN;
        }
    }
}