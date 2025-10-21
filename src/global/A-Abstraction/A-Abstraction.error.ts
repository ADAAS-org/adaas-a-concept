import { A_Error } from "../A-Error/A_Error.class";

export class A_AbstractionError extends A_Error {
    /**
     * This error code indicates that there was an issue extending the abstraction execution
     */
    static readonly AbstractionExtensionError = 'Unable to extend abstraction execution';

}