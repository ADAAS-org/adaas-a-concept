import { A_Error } from "../A-Error/A_Error.class";
export declare class A_ScopeError extends A_Error {
    static readonly InitializationError = "A-Scope Initialization Error";
    static readonly ConstructorError = "Unable to construct A-Scope instance";
    static readonly CircularInheritanceError = "A-Scope Circular Inheritance Error";
}
