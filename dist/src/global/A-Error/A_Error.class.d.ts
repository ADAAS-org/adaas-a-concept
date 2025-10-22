import { A_TYPES__Error_Init, A_TYPES__Error_Serialized } from './A_Error.types';
import { ASEID } from '../ASEID/ASEID.class';
export declare class A_Error<_ConstructorType extends A_TYPES__Error_Init = A_TYPES__Error_Init, _SerializedType extends A_TYPES__Error_Serialized = A_TYPES__Error_Serialized> extends Error {
    /**
     * Error Identifier that corresponds to the class name
     */
    static get entity(): string;
    /**
     * DEFAULT Namespace of the error from environment variable A_CONCEPT_NAMESPACE
     *
     * [!] If environment variable is not set, it will default to 'a-concept'
     */
    static get concept(): string;
    /**
     * DEFAULT Scope of the entity from environment variable A_CONCEPT_DEFAULT_SCOPE
     *
     * [!] If environment variable is not set, it will default to 'core'
     * [!] Scope is an application specific identifier that can be used to group entities together
     * [!] e.g. 'default', 'core', 'public', 'internal', etc
     */
    static get scope(): string;
    /**
     * ASEID of the error instance
     */
    protected _aseid: ASEID;
    /**
     * Title of the error
     */
    protected _title: string;
    /**
     * Possible Scope if needed to identify the error by it's execution environment
     */
    protected _scope?: string;
    /**
     * Unique code representing the type of error
     */
    protected _code?: string;
    /**
     * Detailed description of the error
     */
    protected _description?: string;
    /**
     * Original Error if any
     */
    protected _originalError?: Error | any;
    /**
     * Link to the documentation or support page for the error
     */
    protected _link?: string;
    /**
     * A_Error is a custom error class for A_Concept framework.
     * This error allows to have more structured error handling.
     * Each error has a unique code, description and a link to the documentation.
     *
     * Example of usage:
     * ```typescript
     *
     * // 1) all parameters will be used as provided
     * throw new A_Error({
     *    message: 'User not found',
     *    code: 'USER_NOT_FOUND',
     *    description: 'The user with the given ID was not found.',
     *    link: 'https://support.adaas.org/error/USER_NOT_FOUND'
     * });
     *
     * // or
     * // 2) only message is provided, other parameters will be set to default values:
     * //     - code: 'user-not-found' (kebab-case of the message)
     * //     - description: 'User not found' (same as message)
     * //     - link: Empty
     * throw new A_Error('User not found');
     *
     * // or
     * // 3) Provided Message and Description, other parameters will be set to default values:
     * //     - code: 'user-not-found' (kebab-case of the message)
     * //     - description: 'The user with the given ID was not found.' (as provided)
     * //     - link: Empty
     * throw new A_Error('User not found', 'The user with the given ID was not found.');
     *
     *
     * ```
     * [!] Note: The behavior of A_Error is similar to the A_Entity however it cannot have own A_Features.
     * [!] Note: This class can be inherited to create custom error classes.
     *
     * @param message
     */
    constructor(
    /**
     * A_Error Constructor params
     */
    params: _ConstructorType);
    constructor(
    /**
     * Error message
     */
    message: string);
    constructor(
    /**
     * Original JS Error
     */
    error: Error);
    constructor(
    /**
     * Error message
     */
    title: string, 
    /**
     * Detailed description of the error
     */
    description: string);
    /**
     * Returns the ASEID of the error instance
     */
    get aseid(): ASEID;
    /**
     * Returns the title of the error
     *
     * Example: 'User not found', 'Validation error', 'Unauthorized access', etc.
     *
     * [!] Note: This title should be short and concise, less than 60 characters
     * [!] Note: If title exceeds 60 characters, there would be an error thrown
     * [!] Note: This title is intended to be human-readable and can be displayed in UI or logs
     */
    get title(): string;
    /**
     * Returns an Error message what is a brief title of the error
     *
     */
    get message(): string;
    /**
     * Returns a unique code representing the type of error
     *
     * If code is not provided, it will generate a kebab-case of the message
     *
     * Example: 'validation-error', 'not-found', 'user-not-found', 'unauthorized' etc.
     *
     * [!] Note: It is recommended to use kebab-case for error codes
     * [!] Note: If not provided would be used a kebab-case message of the error
     */
    get code(): string;
    /**
     * Returns the type of the error which corresponds to the static entity of the class
     *
     * Example: 'a-error', 'validation-error', 'not-found-error', 'user-error', etc.
     *
     * Defaults to the kebab-case of the class name
     *
     * [!] Note: naming ad separation are fully dependent on the architecture of the application
     * [!] Note: It is recommended to use kebab-case for error types
     * [!] Note: This type is intended to group similar errors together
     */
    get type(): string;
    /**
     * Returns a link with possible documentation or support page for the error
     * If link is not provided, it will generate a link based on the ASEID of the error that points to the A-Concept support page
     *
     * Example: https://adaas.support/a-concept/errors/{ASEID}
     *
     * [!] Note: ASEID is generated based on the static properties of the class (concept, scope, entity) and the code of the error
     */
    get link(): string;
    /**
     * The scope name of the error instance
     *
     * If scope is not provided, it will use the static scope of the class
     *
     * [!] Note: Scope is an application specific identifier that can be used to group entities together
     * [!] e.g. 'default', 'core', 'public', 'internal', etc
     */
    get scope(): string;
    /**
     * A detailed description of the error
     * If description is not provided, it will use the environment variable A_ERROR_DEFAULT_DESCRIPTION or a generic message
     *
     * Example: 'The user with the given ID was not found.', 'The provided data is invalid.', 'You do not have permission to access this resource.', etc.
     *
     * [!] Note: This description is intended to provide more context about the error and can be used for debugging or logging purposes
     */
    get description(): string;
    /**
     * Returns the original error if any
     *
     * This can be useful for debugging purposes to see the original stack trace or error message
     *
     * [!] Note: Original error is optional and may not be present in all cases
     */
    get originalError(): Error | any | undefined;
    /**
     * Determines which initializer method to use based on the type of the first parameter.
     *
     * @param param1
     * @returns
     */
    protected getInitializer(param1: _ConstructorType | Error | string | any, param2?: string): (param1: any, param2: any) => void | (() => void);
    /**
     * Initializes the A_Error instance from a standard Error object.
     *
     * @param error
     */
    protected fromError(error: Error): void;
    /**
     * Initializes the A_Error instance from a message.
     *
     * @param title
     * @param description
     */
    protected fromMessage(message: string): void;
    fromTitle(title: string, description: string): void;
    /**
     * Initializes the A_Error instance from a constructor parameters object.
     *
     * @param params
     */
    protected fromConstructor(params: _ConstructorType): void;
    /**
     * Serializes the A_Error instance to a plain object.
     *
     *
     * @returns
     */
    toJSON(): _SerializedType;
    /**
     * Checks if the provided title exceeds 60 characters.
     * If it does, throws a validation A_Error.
     *
     * @param title
     */
    protected validateTitle(title: string): void;
}
