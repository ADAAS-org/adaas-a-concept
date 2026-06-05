import { A_Context } from '@adaas/a-concept/a-context';
import {
    A_TYPES__Error_Init,
    A_TYPES__Error_Serialized
} from './A_Error.types';
import {
    A_CONSTANTS__ERROR_CODES,
    A_CONSTANTS__ERROR_DESCRIPTION
} from './A_Error.constants';
import { A_FormatterHelper } from '@adaas/a-concept/helpers/A_Formatter.helper';
import { A_BasicTypeGuards } from '@adaas/a-concept/helpers/A_BasicTypeGuards.helper';
import { ASEID } from '@adaas/a-concept/aseid';
import { A_CONCEPT_ENV } from '@adaas/a-concept/env';


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

            case A_BasicTypeGuards.isErrorSerializedType<_SerializedType>(param1):
                super(param1.message);
                break;

            case A_BasicTypeGuards.isErrorConstructorType<_ConstructorType>(param1) && 'description' in param1:
                super(`[${param1.title}]: ${param1.description}`);
                break;

            case A_BasicTypeGuards.isErrorConstructorType<_ConstructorType>(param1) && !('description' in param1):
                super(param1.title);
                break;

            case A_BasicTypeGuards.isString(param1) && !param2:
                super(param1);
                break;

            case A_BasicTypeGuards.isString(param1) && !!param2:
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
        return this._description || String(A_CONCEPT_ENV.A_ERROR_DEFAULT_DESCRIPTION) || A_CONSTANTS__ERROR_DESCRIPTION;
    }
    /**
     * Returns the original error if any
     * 
     * This can be useful for debugging purposes to see the original stack trace or error message
     * 
     * [!] Note: Original error is optional and may not be present in all cases
     * [!] Note: This is the IMMEDIATE cause — use `rootCause` to walk to the deepest non-A_Error origin.
     */
    get originalError(): Error | any | undefined {
        return this._originalError;
    }

    /**
     * Walks the `originalError` chain and returns the deepest cause.
     *
     * Stops at the first non-A_Error (the actual domain/runtime error) or at
     * an A_Error with no further `originalError`. Returns `undefined` when
     * there is no chain at all.
     *
     * Useful for logs/dashboards that want "what really went wrong" without
     * caring about the framework wrappers (A_FeatureError → A_StageError → ...).
     */
    get rootCause(): Error | any | undefined {
        let current: any = this._originalError;
        if (!current) return undefined;
        while (current instanceof A_Error && current.originalError !== undefined) {
            current = current.originalError;
        }
        return current;
    }

    /**
     * Returns the full causal chain starting from `this` and walking the
     * `originalError` links. The first element is always `this`.
     *
     * Stops walking at the first non-A_Error link (which is included as the
     * last entry). Useful for structured logging:
     *   `for (const link of err.chain) logger.error(link.title, link.message);`
     */
    get chain(): Array<A_Error | Error | any> {
        const out: Array<A_Error | Error | any> = [this];
        let current: any = this._originalError;
        while (current) {
            out.push(current);
            if (!(current instanceof A_Error)) break;
            current = current.originalError;
        }
        return out;
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

            case A_BasicTypeGuards.isString(param1) && !param2:
                return this.fromMessage;

            case A_BasicTypeGuards.isString(param1) && !!param2:
                return this.fromTitle;

            case param1 instanceof Error:
                return this.fromError;

            case A_BasicTypeGuards.isErrorSerializedType<_SerializedType>(param1):
                return this.fromJSON;

            case A_BasicTypeGuards.isErrorConstructorType<_ConstructorType>(param1):
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
        this.appendCausedByStack();
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
        // Rehydrate the original error. We accept three shapes for backward
        // compatibility:
        //   - undefined / null  → no chain.
        //   - string            → legacy (pre-PR2) format: only a message survived.
        //   - object            → either a full A_TYPES__Error_Serialized (has
        //                         `aseid`/`title`) → rehydrate as A_Error, or
        //                         a `{ name, message, stack }` shape → plain Error.
        const oe: any = serialized.originalError;
        if (oe === undefined || oe === null) {
            this._originalError = undefined;
        } else if (typeof oe === 'string') {
            this._originalError = new A_Error(oe);
        } else if (typeof oe === 'object' && 'aseid' in oe && 'title' in oe) {
            this._originalError = new A_Error(oe as _SerializedType);
        } else if (typeof oe === 'object' && ('message' in oe || 'name' in oe)) {
            const e = new Error(oe.message ?? '');
            if (oe.name) e.name = oe.name;
            if (oe.stack) e.stack = oe.stack;
            this._originalError = e;
        } else {
            this._originalError = oe;
        }
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
        this._scope = params.scope ? (A_BasicTypeGuards.isScopeInstance(params.scope) ? (params.scope as any).name : params.scope) : undefined;

        this._aseid = new ASEID({
            concept: (this.constructor as typeof A_Error).concept,
            scope: this._scope || (this.constructor as typeof A_Error).scope,
            entity: (this.constructor as typeof A_Error).entity,
            id: this.code
        });

        this._description = params.description;
        this._link = params.link;

        // Preserve the full causal chain. We used to collapse every A_Error
        // chain to its deepest root here, which silently dropped every
        // intermediate framework wrapper (e.g. Feature → Stage → Domain
        // would surface as just Domain). Investigators then could not tell
        // whether the failure happened in stage compilation, argument
        // resolution, or inside the handler.
        //
        // Now `originalError` holds the IMMEDIATE cause as-passed; callers
        // who want the deepest origin can use the `rootCause` getter.
        this._originalError = params.originalError;

        this.appendCausedByStack();
    }

    /**
     * Appends the `originalError` stack to `this.stack` using a Java/Python
     * style "Caused by:" separator. This keeps the standard error printer
     * useful for layered errors without forcing callers to walk the chain
     * manually.
     *
     * No-op when there is no `originalError`, when stacks are unavailable
     * (some runtimes / serialized errors), or when the original stack is
     * already a suffix of `this.stack` (defensive against double-append on
     * re-wrap).
     */
    protected appendCausedByStack(): void {
        const orig: any = this._originalError;
        if (!orig) return;
        const origStack: string | undefined = typeof orig.stack === 'string' ? orig.stack : undefined;
        if (!origStack) return;
        const myStack: string | undefined = typeof this.stack === 'string' ? this.stack : undefined;
        if (!myStack) return;
        if (myStack.includes(origStack)) return;
        this.stack = `${myStack}\nCaused by: ${origStack}`;
    }

    /**
     * Serializes the A_Error instance to a plain object.
     *
     * `originalError` is serialized as a structured object (recursively for
     * A_Error chains) instead of the original message-only string so that
     * transport / log sinks preserve the full causal chain.
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
            originalError: this.serializeOriginalError(this._originalError),
        } as _SerializedType;
    }

    /**
     * Recursively serializes the immediate `originalError`:
     *  - `undefined` if absent.
     *  - For nested A_Error: full `toJSON()` (chain preserved).
     *  - For plain Error: `{ name, message, stack }` minimal shape.
     *  - For non-error throwables: the value itself if JSON-safe, else `String(value)`.
     */
    protected serializeOriginalError(err: any): any {
        if (err === undefined || err === null) return undefined;
        if (err instanceof A_Error) return err.toJSON();
        if (err instanceof Error) {
            return {
                name: err.name,
                message: err.message,
                stack: err.stack,
            };
        }
        try {
            // JSON-safe scalar / plain object
            JSON.stringify(err);
            return err;
        } catch {
            return String(err);
        }
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

