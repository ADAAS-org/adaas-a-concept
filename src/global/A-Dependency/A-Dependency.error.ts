import { A_Error } from "../A-Error/A_Error.class";

export class A_DependencyError extends A_Error {

    static readonly InvalidDependencyTarget = 'Invalid Dependency Target';

    static readonly InvalidLoadTarget = 'Invalid Load Target';

    static readonly InvalidLoadPath = 'Invalid Load Path';


    static readonly InvalidDefaultTarget = 'Invalid Default Target';
}