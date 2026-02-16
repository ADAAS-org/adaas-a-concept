import { A_Error } from "@adaas/a-concept/a-error";



export class A_StepManagerError extends A_Error {


    static readonly CircularDependencyError = 'A-StepManager Circular Dependency Error';

}