import { A_Error } from "../A-Error/A_Error.class";



export class A_EntityError extends A_Error {

    /**
     * Error code for validation errors.
     */
    static readonly ValidationError = 'A-Entity Validation Error';

}