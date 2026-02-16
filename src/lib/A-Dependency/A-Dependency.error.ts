import { A_Error } from "@adaas/a-concept/a-error";

export class A_DependencyError extends A_Error {

    static readonly InvalidDependencyTarget = 'Invalid Dependency Target';

    static readonly InvalidLoadTarget = 'Invalid Load Target';

    static readonly InvalidLoadPath = 'Invalid Load Path';


    static readonly InvalidDefaultTarget = 'Invalid Default Target';


    static readonly ResolutionParametersError = 'Dependency Resolution Parameters Error';
}