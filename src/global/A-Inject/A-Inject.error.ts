import { A_Error } from "@adaas/a-concept/global/A-Error/A_Error.class";


export class A_InjectError extends A_Error {
    static readonly InvalidInjectionTarget = 'Invalid target for A-Inject decorator';

    static readonly MissingInjectionTarget = 'Missing target for A-Inject decorator';
}