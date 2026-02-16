import { A_Error } from "@adaas/a-concept/a-error";



export class A_EntityError extends A_Error {

    /**
     * Error code for validation errors.
     */
    static readonly ValidationError = 'A-Entity Validation Error';

}