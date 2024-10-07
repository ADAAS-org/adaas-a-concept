import { A_Namespace } from "@adaas/a-concept/global/A-Namespace/A_Namespace.class";
import { Logger } from "./components/Logger.component";


export class A_LoggerContext extends A_Namespace {

    Logger!: Logger

    readonly colors = {
        green: '32',
        blue: '34',
        red: '31',
        yellow: '33',
        gray: '90',
        magenta: '35',
        cyan: '36',
        white: '37',
        pink: '95',
    } as const


    constructor() {
        super();
    }

}