"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_Error = void 0;
const A_Error_constants_1 = require("./A_Error.constants");
const A_Formatter_helper_1 = require("../../helpers/A_Formatter.helper");
const A_Context_class_1 = require("../A-Context/A-Context.class");
const A_TypeGuards_helper_1 = require("../../helpers/A_TypeGuards.helper");
const ASEID_class_1 = require("../ASEID/ASEID.class");
const env_constants_1 = require("../../constants/env.constants");
class A_Error extends Error {
    // ====================================================================
    // ================== Static A-Error Information ======================
    // ====================================================================
    /**
     * Error Identifier that corresponds to the class name
     */
    static get entity() {
        return A_Formatter_helper_1.A_FormatterHelper.toKebabCase(this.name);
    }
    /**
     * DEFAULT Namespace of the error from environment variable A_CONCEPT_NAMESPACE
     *
     * [!] If environment variable is not set, it will default to 'a-concept'
     */
    static get concept() {
        return A_Context_class_1.A_Context.concept;
    }
    /**
     * DEFAULT Scope of the entity from environment variable A_CONCEPT_DEFAULT_SCOPE
     *
     * [!] If environment variable is not set, it will default to 'core'
     * [!] Scope is an application specific identifier that can be used to group entities together
     * [!] e.g. 'default', 'core', 'public', 'internal', etc
     */
    static get scope() {
        return A_Context_class_1.A_Context.root.name;
    }
    constructor(param1, param2) {
        //  to prevent errors accumulation in the stack trace it returns the original error if provided param1 is A_Error
        switch (true) {
            case param1 instanceof A_Error:
                return param1;
            case param1 instanceof Error:
                super(param1.message);
                break;
            case A_TypeGuards_helper_1.A_TypeGuards.isConstructorType(param1) && 'description' in param1:
                super(`[${param1.title}]: ${param1.description}`);
                break;
            case A_TypeGuards_helper_1.A_TypeGuards.isConstructorType(param1) && !('description' in param1):
                super(param1.title);
                break;
            case A_TypeGuards_helper_1.A_TypeGuards.isString(param1) && !param2:
                super(param1);
                break;
            case A_TypeGuards_helper_1.A_TypeGuards.isString(param1) && !!param2:
                super(`[${param1}]: ${param2}`);
                break;
            default:
                throw new A_Error(A_Error_constants_1.A_CONSTANTS__ERROR_CODES.VALIDATION_ERROR, 'Invalid parameters provided to A_Error constructor');
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
    get aseid() {
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
    get title() {
        return this._title;
    }
    /**
     * Returns an Error message what is a brief title of the error
     *
     */
    get message() {
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
    get code() {
        return this._code || A_Formatter_helper_1.A_FormatterHelper.toKebabCase(this.title);
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
        return this.constructor.entity;
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
        return this._aseid.scope;
    }
    /**
     * A detailed description of the error
     * If description is not provided, it will use the environment variable A_ERROR_DEFAULT_DESCRIPTION or a generic message
     *
     * Example: 'The user with the given ID was not found.', 'The provided data is invalid.', 'You do not have permission to access this resource.', etc.
     *
     * [!] Note: This description is intended to provide more context about the error and can be used for debugging or logging purposes
     */
    get description() {
        return this._description || process.env[env_constants_1.A_CONSTANTS__DEFAULT_ENV_VARIABLES.A_ERROR_DEFAULT_DESCRIPTION] || A_Error_constants_1.A_CONSTANTS__ERROR_DESCRIPTION;
    }
    /**
     * Returns the original error if any
     *
     * This can be useful for debugging purposes to see the original stack trace or error message
     *
     * [!] Note: Original error is optional and may not be present in all cases
     */
    get originalError() {
        return this._originalError;
    }
    /**
     * Determines which initializer method to use based on the type of the first parameter.
     *
     * @param param1
     * @returns
     */
    getInitializer(param1, param2) {
        switch (true) {
            case A_TypeGuards_helper_1.A_TypeGuards.isString(param1) && !param2:
                return this.fromMessage;
            case A_TypeGuards_helper_1.A_TypeGuards.isString(param1) && !!param2:
                return this.fromTitle;
            case param1 instanceof Error:
                return this.fromError;
            case A_TypeGuards_helper_1.A_TypeGuards.isConstructorType(param1):
                return this.fromConstructor;
            default: {
                console.log('INVALID PARAMS PROVIDED TO A_ERROR CONSTRUCTOR: ', param1);
                throw new A_Error(A_Error_constants_1.A_CONSTANTS__ERROR_CODES.VALIDATION_ERROR, 'Invalid parameters provided to A_Error constructor');
            }
        }
    }
    /**
     * Initializes the A_Error instance from a standard Error object.
     *
     * @param error
     */
    fromError(error) {
        this._title = A_Error_constants_1.A_CONSTANTS__ERROR_CODES.UNEXPECTED_ERROR;
        this._aseid = new ASEID_class_1.ASEID({
            concept: this.constructor.concept,
            scope: this.constructor.scope,
            entity: this.constructor.entity,
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
    fromMessage(message) {
        this._title = A_Error_constants_1.A_CONSTANTS__ERROR_CODES.UNEXPECTED_ERROR;
        this._aseid = new ASEID_class_1.ASEID({
            concept: this.constructor.concept,
            scope: this._scope || this.constructor.scope,
            entity: this.constructor.entity,
            id: this.code
        });
        this._link = undefined;
        this._originalError = undefined;
    }
    fromTitle(title, description) {
        this.validateTitle(title);
        this._title = title;
        this._description = description;
        this._aseid = new ASEID_class_1.ASEID({
            concept: this.constructor.concept,
            scope: this._scope || this.constructor.scope,
            entity: this.constructor.entity,
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
    fromConstructor(params) {
        this.validateTitle(params.title);
        this._title = params.title;
        this._code = params.code;
        this._scope = params.scope ? (A_TypeGuards_helper_1.A_TypeGuards.isScopeInstance(params.scope) ? params.scope.name : params.scope) : undefined;
        this._aseid = new ASEID_class_1.ASEID({
            concept: this.constructor.concept,
            scope: this._scope || this.constructor.scope,
            entity: this.constructor.entity,
            id: this.code
        });
        this._description = params.description;
        this._link = params.link;
        this._originalError = params.originalError;
    }
    /**
     * Serializes the A_Error instance to a plain object.
     *
     *
     * @returns
     */
    toJSON() {
        var _a;
        return {
            aseid: this.aseid.toString(),
            title: this.title,
            code: this.code,
            type: this.type,
            message: this.message,
            link: this.link,
            scope: this.scope,
            description: this.description,
            originalError: (_a = this.originalError) === null || _a === void 0 ? void 0 : _a.message
        };
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
    validateTitle(title) {
        if (title.length > 60) {
            throw new A_Error(A_Error_constants_1.A_CONSTANTS__ERROR_CODES.VALIDATION_ERROR, 'A-Error title exceeds 60 characters limit.');
        }
        if (title.length === 0) {
            throw new A_Error(A_Error_constants_1.A_CONSTANTS__ERROR_CODES.VALIDATION_ERROR, 'A-Error title cannot be empty.');
        }
    }
}
exports.A_Error = A_Error;
// message = title + description for better printing in the console
// description = detailed information about the error
// code = kebabcase (title)
//# sourceMappingURL=A_Error.class.js.map