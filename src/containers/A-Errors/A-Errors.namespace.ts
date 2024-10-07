import { A_Namespace } from "@adaas/a-concept/global/A-Namespace/A_Namespace.class";
import { A_CONSTANTS__ERROR_CODES, A_Error, A_ServerError, A_TYPES__Dictionary, A_TYPES__Error, A_TYPES__ServerError } from "@adaas/a-utils";
import { A_TYPES__A_ErrorsConstructor } from "./A-Errors.types";
import { A_CONSTANTS__DEFAULT_ERRORS } from "@adaas/a-utils/dist/src/constants/errors.constants";


export class A_Errors extends A_Namespace<Partial<A_TYPES__A_ErrorsConstructor>> {



    protected registeredErrors: Map<string, A_TYPES__Error | A_TYPES__ServerError> = new Map();

    constructor(
        params: Partial<A_TYPES__A_ErrorsConstructor>
    ) {
        super(params);

        if (params.errors) {
            this.addRegistry(params.errors);
        }
        this.addRegistry(A_CONSTANTS__DEFAULT_ERRORS);
    }


    /**
     * This method adds a dictionary of errors to the registry.
     * 
     * @param registry 
     */
    addRegistry(
        registry: A_TYPES__Dictionary<A_TYPES__Error> | A_TYPES__Error[]
    ): A_Errors {
        const errors = Array.isArray(registry) ? registry : Object.values(registry);

        errors.forEach(err => this.registerError(err));

        return this;
    }


    /**
     * 
     * Adds an error to the registry
     * 
     * @param error 
     */
    registerError(error: A_TYPES__Error): A_Errors {
        this.registeredErrors.set(error.code, {
            ...error,
            code: `${this.name}@error:${error.code}`
        });

        return this;
    }

    /**
     * This method returns an error object by its code.
     * 
     * @param code 
     * @returns 
     */
    getError(code: A_CONSTANTS__ERROR_CODES | string): A_ServerError | A_Error | undefined {
        let template = this.registeredErrors.get(code);

        if (!template)
            template = this.registeredErrors.get(A_CONSTANTS__ERROR_CODES.UNEXPECTED_ERROR);

        if ((template as A_TYPES__ServerError).serverCode) {
            return new A_ServerError(template as A_TYPES__ServerError);
        } else {
            return new A_Error(template);
        }
    }


    /**
     * This method throws an error by its code.
     * 
     * @param code 
     */
    throw(code: A_CONSTANTS__ERROR_CODES | string): never {

        const err = this.getError(code);

        throw err;
    }


    /**
     *  This method wraps an error into the SDK error object.
     * 
     * @param error 
     * @returns 
     */
    wrap(error: Error | A_Error | unknown): A_ServerError | A_Error {
        if (error instanceof A_Error) {
            return new A_ServerError(error);
        }

        return new A_Error(error);
    }


} 