import { A_Scope } from "../../global/A-Scope/A-Scope.class";
import { A_Errors } from "./A-Errors.context";
import { A_CONSTANTS__ERROR_CODES, A_Error, A_ServerError } from "@adaas/a-utils";
export declare class A_ErrorsManager {
    protected scope: A_Scope;
    protected errors: A_Errors;
    constructor(scope: A_Scope, errors: A_Errors);
    throw(error: Error | unknown | any): never;
    throw(code: A_CONSTANTS__ERROR_CODES | string): never;
    throw(error: A_Error | A_ServerError): never;
    /**
     *  This method wraps an error into the SDK error object.
     *
     * @param error
     * @returns
     */
    wrap(error: Error | A_Error | unknown | any): A_ServerError | A_Error;
}
