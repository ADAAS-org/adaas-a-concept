import { A_Scope } from "../A-Scope/A-Scope.class";
import { A_Error } from "./A_Error.class";
/**
 * Entity constructor type
 * Uses the generic type T to specify the type of the entity
 */
export type A_TYPES__Error_Constructor<T = A_Error> = new (...args: any[]) => T;
/**
 * Error initialization type
 */
export type A_TYPES__Error_Init = {
    /**
     * Error message
     *
     * A short description of the error
     */
    message: string;
    /**
     * Error code representing the type of error
     *
     * Should be unique within the application or service
     *
     * Example: 'validation-error', 'not-found', 'user-not-found', 'unauthorized' etc.
     *
     * [!] Note: It is recommended to use kebab-case for error codes
     * [!] Note: If not provided would be used a kebab-case message of the error
     */
    code?: string;
    /**
     * Possible Scope if needed to identify the error by it's execution environment
     *
     * For example, error of type 'validation' could happen in different scopes
     * like 'user', 'admin', 'system' etc. This will help to identify the error context better
     *
     * Could be string or A_Scope instance
     *
     * [!] Note: If not provided, the default scope of the A_Error will be used (A_Context.root.name)
     */
    scope?: string | A_Scope;
    /**
     * Detailed description of the error
     */
    description?: string;
    /**
     * Link to the documentation or support page for the error
     */
    link?: string;
    /**
     * Original Error if any
     */
    originalError?: Error | unknown;
};
/**
 * Error serialized type
 */
export type A_TYPES__Error_Serialized = {
    /**
     * ASEID of the error
     */
    aseid: string;
    /**
     * Error message
     */
    message: string;
    /**
     * Type of the error
     */
    type: string;
    /**
     * Error code
     */
    code: string;
    /**
     * Error description
     */
    description: string;
    /**
     * Link to documentation or support page
     */
    link?: string;
    /**
     * Scope of the error
     */
    scope: string;
    /**
     * Original error message if any
     */
    originalError?: string;
};
