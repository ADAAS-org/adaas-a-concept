import { A_Scope } from "@adaas/a-concept/global/A-Scope/A-Scope.class";
import { A_Inject } from "@adaas/a-concept/decorators/A-Inject/A-Inject.decorator";
import { A_Errors } from "./A-Errors.context";
import { A_CONSTANTS__ERROR_CODES, A_Error, A_ServerError, ASEID } from "@adaas/a-utils";
import { A_Context } from "@adaas/a-concept/global/A-Context/A-Context.class";
import { A_Component } from "@adaas/a-concept/global/A-Component/A-Component.class";

export class A_ErrorsManager extends A_Component {

    constructor(
        @A_Inject(A_Scope) protected scope: A_Scope,
        @A_Inject(A_Errors) protected errors: A_Errors
    ) {
        super();
    }




    throw(
        error: Error | unknown | any
    ): never
    throw(
        code: A_CONSTANTS__ERROR_CODES | string
    ): never
    throw(
        error: A_Error | A_ServerError
    ): never
    throw(
        param: A_CONSTANTS__ERROR_CODES | string | A_Error | A_ServerError
    ): never {
        switch (true) {
            // In case of error code
            case typeof param === 'string':
                const template = this.errors.get(param);
                const namedCode = `${A_Context.root.name}@${this.scope.name}:error:${template.code}`

                if ('serverCode' in template)
                    throw new A_ServerError({
                        ...template,
                        code: namedCode
                    });
                else
                    throw new A_Error({
                        ...template,
                        code: namedCode
                    })

            // In case of error object
            case param instanceof A_Error:
                throw param;

            // Otherwise wrap the error
            default:
                throw this.wrap(param);
        }
    }


    /**
     *  This method wraps an error into the SDK error object.
     * 
     * @param error 
     * @returns 
     */
    wrap(error: Error | A_Error | unknown | any): A_ServerError | A_Error {

        switch (true) {
            case error instanceof A_Error:
                let newCode = `${A_Context.root.name}@${this.scope.name}:error:${error.code}`;

                if (ASEID.isASEID(error.code)) {
                    const aseid = new ASEID(error.code);

                    if (aseid.scope !== this.scope.name)
                        newCode = `${A_Context.root.name}@${this.scope.name}:error:${aseid.id}`;
                }

                if ('serverCode' in error)
                    return new A_ServerError({
                        originalError: error,
                        code: newCode,
                        serverCode: error.serverCode,
                        name: error.name,
                        message: error.message,
                        link: error.link,
                        description: error.description
                    });
                else
                    return new A_Error({
                        originalError: error,
                        code: newCode,
                        name: error.name,
                        message: error.message,
                        link: error.link,
                        description: error.description
                    });

            default:
                return new A_Error(error);
        }
    }
}