import { A_Error } from "@adaas/a-concept/a-error";

export class A_AbstractionError extends A_Error {
    /**
     * This error code indicates that there was an issue extending the abstraction execution
     */
    static readonly AbstractionExtensionError = 'Unable to extend abstraction execution';

}