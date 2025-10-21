import { A_Error } from "../A-Error/A_Error.class";
export declare class A_CallerError extends A_Error {
    /**
     * This error code indicates that there was an issue initializing the A-Caller
     */
    static readonly CallerInitializationError = "Unable to initialize A-Caller";
}
