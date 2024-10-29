import { A_CONSTANTS__ERROR_CODES, A_Error, A_ServerError, A_TYPES__Dictionary, A_TYPES__Error, A_TYPES__ServerError } from "@adaas/a-utils";
import { A_TYPES__A_ErrorsConstructor } from "./A-Errors.types";
import { A_CONSTANTS__DEFAULT_ERRORS } from "@adaas/a-utils/dist/src/constants/errors.constants";
import { A_Fragment } from "@adaas/a-concept/global/A-Fragment/A-Fragment.class";


export class A_Errors extends A_Fragment {

    protected registeredErrors: Map<string, A_TYPES__Error | A_TYPES__ServerError> = new Map();

    constructor(
        params: Partial<A_TYPES__A_ErrorsConstructor>
    ) {

        super({
            ...params,
            name: params.name || 'a-errors'
        });

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
        this.registeredErrors.set(error.code, error);

        return this;
    }


    /**
     * This method returns an error object by its code.
     * 
     * @param code 
     * @returns 
     */
    get(code: A_CONSTANTS__ERROR_CODES | string): A_TYPES__Error | A_TYPES__ServerError {
        let template = this.registeredErrors.get(code);

        if (!template)
            template = this.registeredErrors.get(A_CONSTANTS__ERROR_CODES.UNEXPECTED_ERROR)!;

        return template;
    }


    /**
     * Allows to throw an error by its code. 
     * [!] BUT WITHOUT Connection to particular Scope
     * 
     * This method throws an error by its code.
     * 
     * @param code 
     */
    // throw(code: A_CONSTANTS__ERROR_CODES | string): never {
    //     const template = this.get(code);

    //     if ('serverCode' in template)
    //         throw new A_ServerError(template);
    //     else
    //         throw new A_Error(template)
    // }
} 