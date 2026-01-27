import {
    A_TYPES__Error_Init,
    A_TYPES__Error_Serialized
} from './A_Error.types';
import {
    A_CONSTANTS__ERROR_CODES,
    A_CONSTANTS__ERROR_DESCRIPTION
} from './A_Error.constants';
import { A_FormatterHelper } from '@adaas/a-concept/helpers/A_Formatter.helper';
import { A_Context } from '../A-Context/A-Context.class';
import { A_TypeGuards } from '@adaas/a-concept/helpers/A_TypeGuards.helper';
import { ASEID } from '../ASEID/ASEID.class';
import { A_CONSTANTS__DEFAULT_ENV_VARIABLES } from '@adaas/a-concept/constants/env.constants';


export class A_Error<
    _ConstructorType extends A_TYPES__Error_Init = A_TYPES__Error_Init,
    _SerializedType extends A_TYPES__Error_Serialized = A_TYPES__Error_Serialized
> extends Error {
    // ====================================================================
    // ================== Static A-Error Information ======================
    // ====================================================================
    /**
     * Error Identifier that corresponds to the class name
     */
    static get entity(): string {
        return A_FormatterHelper.toKebabCase(this.name);
    }
    /**
     * DEFAULT Namespace of the error from environment variable A_CONCEPT_NAMESPACE
     * 
     * [!] If environment variable is not set, it will default to 'a-concept'
     */
    static get concept(): string {
        return A_Context.concept;
    }
    /**
     * DEFAULT Scope of the entity from environment variable A_CONCEPT_DEFAULT_SCOPE
     * 
     * [!] If environment variable is not set, it will default to 'core'
     * [!] Scope is an application specific identifier that can be used to group entities together
     * [!] e.g. 'default', 'core', 'public', 'internal', etc
     */
    static get scope(): string {
        return A_Context.root.name;
    }

    // ====================================================================
    // ================== Hidden A-Error Information ======================
    // ====================================================================
    /**
     * ASEID of the error instance
     */
    protected _aseid!: ASEID;
    /**
     * Title of the error
     */
    protected _title!: string;
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
    protected _originalError?: Error | any
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
        params: _ConstructorType
    )
    constructor(
        /**
         * Error message
         */
        message: string
    )
    constructor(
        /**
         * Original JS Error
         */
        error: Error
    )
    constructor(
        /**
         * Original JS Error
         */
        error: unknown
    )
    constructor(
        /**
         * Error message
         */
        title: string,
        /**
         * Detailed description of the error
         */
        description: string
    )
    constructor(
        param1: _ConstructorType | Error | string | A_Error | any,
        param2?: string
    ) {
        //  to prevent errors accumulation in the stack trace it returns the original error if provided param1 is A_Error
        switch (true) {
            case param1 instanceof A_Error:
                return param1 as A_Error<_ConstructorType, _SerializedType>;

            case param1 instanceof Error:
                super(param1.message);
                break;

            case A_TypeGuards.isErrorSerializedType<_SerializedType>(param1):
                super(param1.message);
                break;

            case A_TypeGuards.isErrorConstructorType<_ConstructorType>(param1) && 'description' in param1:
                super(`[${param1.title}]: ${param1.description}`);
                break;

            case A_TypeGuards.isErrorConstructorType<_ConstructorType>(param1) && !('description' in param1):
                super(param1.title);
                break;

            case A_TypeGuards.isString(param1) && !param2:
                super(param1);
                break;

            case A_TypeGuards.isString(param1) && !!param2:
                super(`[${param1}]: ${param2}`);
                break;

            default:
                super('An unknown error occurred.');
        }

        const initializer = this.getInitializer(param1, param2);
        // the returned initializer is already bound to `this` (we used .bind(this)),
        // so calling it will run the appropriate logic on this instance:
        initializer.call(this, param1, param2);
    }



    // ====================================================================
    // ================== Public A-Error Information ======================
    // ====================================================================
    /**
     * Returns the ASEID of the error instance
     */
    get aseid(): ASEID {
        return this._aseid;
    }
    /**
     * Returns the title of the error
     * 
     * Example: 'User not found', 'Validation error', 'Unauthorized access', etc.
     * 
     * [!] Note: This title should be short and concise, less than 60 characters
     * [!] Note: If title exceeds 60 characters, there would be an error thrown
     * [!] Note: This title is intended to be human-readable and can be displayed in UI or logs
     */
    get title(): string {
        return this._title;
    }
    /**
     * Returns an Error message what is a brief title of the error
     * 
     */
    get message(): string {
        return super.message;
    }
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
    get code(): string {
        return this._code || A_FormatterHelper.toKebabCase(this.title);
    }
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
    get type() {
        return (this.constructor as typeof A_Error).entity;
    }
    /**
     * Returns a link with possible documentation or support page for the error
     * If link is not provided, it will generate a link based on the ASEID of the error that points to the A-Concept support page
     * 
     * Example: https://adaas.support/a-concept/errors/{ASEID}
     * 
     * [!] Note: ASEID is generated based on the static properties of the class (concept, scope, entity) and the code of the error
     */
    get link() {
        if (this._link)
            return this._link;

        const url = new URL(`https://adaas.support/a-concept/errors/${this.aseid.toString()}`);

        return url.toString();
    }
    /**
     * The scope name of the error instance
     * 
     * If scope is not provided, it will use the static scope of the class
     * 
     * [!] Note: Scope is an application specific identifier that can be used to group entities together
     * [!] e.g. 'default', 'core', 'public', 'internal', etc
     */
    get scope() {
        return this._aseid.scope
    }
    /**
     * A detailed description of the error
     * If description is not provided, it will use the environment variable A_ERROR_DEFAULT_DESCRIPTION or a generic message
     * 
     * Example: 'The user with the given ID was not found.', 'The provided data is invalid.', 'You do not have permission to access this resource.', etc.
     * 
     * [!] Note: This description is intended to provide more context about the error and can be used for debugging or logging purposes
     */
    get description(): string {
        return this._description || process.env[A_CONSTANTS__DEFAULT_ENV_VARIABLES.A_ERROR_DEFAULT_DESCRIPTION] || A_CONSTANTS__ERROR_DESCRIPTION;
    }
    /**
     * Returns the original error if any
     * 
     * This can be useful for debugging purposes to see the original stack trace or error message
     * 
     * [!] Note: Original error is optional and may not be present in all cases
     */
    get originalError(): Error | any | undefined {
        return this._originalError;
    }



    /**
     * Determines which initializer method to use based on the type of the first parameter.
     * 
     * @param param1 
     * @returns
     */
    protected getInitializer(
        param1: _ConstructorType | Error | string | any,
        param2?: string
    ): (param1: any, param2: any) => void | (() => void) {
        switch (true) {

            case A_TypeGuards.isString(param1) && !param2:
                return this.fromMessage;

            case A_TypeGuards.isString(param1) && !!param2:
                return this.fromTitle;

            case param1 instanceof Error:
                return this.fromError;

            case A_TypeGuards.isErrorSerializedType<_SerializedType>(param1):
                return this.fromJSON;

            case A_TypeGuards.isErrorConstructorType<_ConstructorType>(param1):
                return this.fromConstructor;

            default: {
                throw new A_Error(
                    A_CONSTANTS__ERROR_CODES.VALIDATION_ERROR,
                    'Invalid parameters provided to A_Error constructor'
                );
            }
        }
    }

    /**
     * Initializes the A_Error instance from a standard Error object.
     * 
     * @param error 
     */
    protected fromError(error: Error): void {
        this._title = A_CONSTANTS__ERROR_CODES.UNEXPECTED_ERROR;

        this._aseid = new ASEID({
            concept: (this.constructor as typeof A_Error).concept,
            scope: (this.constructor as typeof A_Error).scope,
            entity: (this.constructor as typeof A_Error).entity,
            id: this.code
        });

        this._originalError = error;
    }
    /**
     * Initializes the A_Error instance from a message.
     * 
     * @param title 
     * @param description 
     */
    protected fromMessage(message: string): void {
        this._title = A_CONSTANTS__ERROR_CODES.UNEXPECTED_ERROR;

        this._aseid = new ASEID({
            concept: (this.constructor as typeof A_Error).concept,
            scope: this._scope || (this.constructor as typeof A_Error).scope,
            entity: (this.constructor as typeof A_Error).entity,
            id: this.code
        });

        this._link = undefined;
        this._originalError = undefined;
    }
    /**
     * Initializes the A_Error instance from a serialized object.
     * 
     * @param serialized
     */
    protected fromJSON(serialized: _SerializedType): void {
        this._aseid = new ASEID(serialized.aseid);
        super.message = serialized.message;
        this._title = serialized.title;
        this._code = serialized.code;
        this._scope = serialized.scope;
        this._description = serialized.description;
        // Note: originalError is deserialized as message only
        this._originalError = serialized.originalError ? new A_Error(serialized.originalError) : undefined;
        this._link = serialized.link;
    }



    fromTitle(title: string, description: string): void {
        this.validateTitle(title);

        this._title = title;
        this._description = description;

        this._aseid = new ASEID({
            concept: (this.constructor as typeof A_Error).concept,
            scope: this._scope || (this.constructor as typeof A_Error).scope,
            entity: (this.constructor as typeof A_Error).entity,
            id: this.code
        });

        this._link = undefined;
        this._originalError = undefined;
    }
    /**
     * Initializes the A_Error instance from a constructor parameters object.
     * 
     * @param params 
     */
    protected fromConstructor(params: _ConstructorType): void {
        this.validateTitle(params.title);

        this._title = params.title;
        this._code = params.code;
        this._scope = params.scope ? (A_TypeGuards.isScopeInstance(params.scope) ? params.scope.name : params.scope) : undefined;

        this._aseid = new ASEID({
            concept: (this.constructor as typeof A_Error).concept,
            scope: this._scope || (this.constructor as typeof A_Error).scope,
            entity: (this.constructor as typeof A_Error).entity,
            id: this.code
        });

        this._description = params.description;
        this._link = params.link;

        // Handle originalError: if it's an A_Error, we should trace back to the root cause
        // to avoid infinite nesting of A_Error instances
        if (params.originalError instanceof A_Error) {
            // Find the root original error by traversing the chain
            let rootError = params.originalError;
            while (rootError.originalError instanceof A_Error) {
                rootError = rootError.originalError;
            }
            // Set the root cause as the original error
            this._originalError = rootError.originalError || rootError;
        } else {
            this._originalError = params.originalError;
        }
    }

    /**
     * Serializes the A_Error instance to a plain object.
     * 
     * 
     * @returns 
     */
    toJSON(): _SerializedType {
        return {
            aseid: this.aseid.toString(),
            title: this.title,
            code: this.code,
            type: this.type,
            message: this.message,
            link: this.link,
            scope: this.scope,
            description: this.description,
            originalError: this.originalError?.message
        } as _SerializedType;
    }



    // --------------------------------------------------------------------------
    // ----------------------- PROTECTED HELPERS --------------------------------
    // --------------------------------------------------------------------------
    /**
     * Checks if the provided title exceeds 60 characters.
     * If it does, throws a validation A_Error.
     * 
     * @param title 
     */
    protected validateTitle(title: string) {
        if (title.length > 60) {
            throw new A_Error(
                A_CONSTANTS__ERROR_CODES.VALIDATION_ERROR,
                'A-Error title exceeds 60 characters limit.'
            );
        }
        if (title.length === 0) {
            throw new A_Error(
                A_CONSTANTS__ERROR_CODES.VALIDATION_ERROR,
                'A-Error title cannot be empty.'
            );
        }
    }
}





// message = title + description for better printing in the console
// description = detailed information about the error
// code = kebabcase (title)

