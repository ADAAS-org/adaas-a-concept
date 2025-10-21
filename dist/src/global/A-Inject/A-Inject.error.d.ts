import { A_Error } from "../A-Error/A_Error.class";
export declare class A_InjectError extends A_Error {
    static readonly InvalidInjectionTarget = "Invalid target for A-Inject decorator";
    static readonly MissingInjectionTarget = "Missing target for A-Inject decorator";
}
