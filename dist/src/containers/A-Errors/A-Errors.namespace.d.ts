import { A_Namespace } from "@adaas/a-concept/global/A-Namespace/A_Namespace.class";
import { A_CONSTANTS__ERROR_CODES, A_Error, A_ServerError, A_TYPES__Dictionary, A_TYPES__Error, A_TYPES__ServerError } from "@adaas/a-utils";
import { A_TYPES__A_ErrorsConstructor } from "./A-Errors.types";
export declare class A_Errors extends A_Namespace<Partial<A_TYPES__A_ErrorsConstructor>> {
    protected registeredErrors: Map<string, A_TYPES__Error | A_TYPES__ServerError>;
    constructor(params: Partial<A_TYPES__A_ErrorsConstructor>);
    /**
     * This method adds a dictionary of errors to the registry.
     *
     * @param registry
     */
    addRegistry(registry: A_TYPES__Dictionary<A_TYPES__Error> | A_TYPES__Error[]): A_Errors;
    /**
     *
     * Adds an error to the registry
     *
     * @param error
     */
    registerError(error: A_TYPES__Error): A_Errors;
    /**
     * This method returns an error object by its code.
     *
     * @param code
     * @returns
     */
    getError(code: A_CONSTANTS__ERROR_CODES | string): A_ServerError | A_Error | undefined;
    /**
     * This method throws an error by its code.
     *
     * @param code
     */
    throw(code: A_CONSTANTS__ERROR_CODES | string): never;
    /**
     *  This method wraps an error into the SDK error object.
     *
     * @param error
     * @returns
     */
    wrap(error: Error | A_Error | unknown): A_ServerError | A_Error;
}
