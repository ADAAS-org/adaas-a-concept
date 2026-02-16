import { A_Error } from "@adaas/a-concept/a-error";


export class A_InjectError extends A_Error {
    static readonly InvalidInjectionTarget = 'Invalid target for A-Inject decorator';

    static readonly MissingInjectionTarget = 'Missing target for A-Inject decorator';
}