import { A_Error } from "@adaas/a-concept/a-error";


export class A_StageError extends A_Error {

    static readonly ArgumentsResolutionError = 'A-Stage Arguments Resolution Error';


    static get CompileError(): string {
        return 'Unable to compile A-Stage';
    }

}
