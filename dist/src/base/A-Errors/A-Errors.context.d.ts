import { A_CONSTANTS__ERROR_CODES, A_TYPES__Dictionary, A_TYPES__Error, A_TYPES__ServerError } from "@adaas/a-utils";
import { A_TYPES__A_ErrorsConstructor } from "./A-Errors.types";
import { A_Fragment } from "../../global/A-Fragment/A-Fragment.class";
export declare class A_Errors extends A_Fragment {
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
    get(code: A_CONSTANTS__ERROR_CODES | string): A_TYPES__Error | A_TYPES__ServerError;
}
