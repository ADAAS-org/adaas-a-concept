import { A_Namespace } from "@adaas/a-concept/global/A-Namespace/A_Namespace.class";
import { Logger } from "./components/Logger.component";
export declare class A_LoggerContext extends A_Namespace {
    Logger: Logger;
    readonly colors: {
        readonly green: "32";
        readonly blue: "34";
        readonly red: "31";
        readonly yellow: "33";
        readonly gray: "90";
        readonly magenta: "35";
        readonly cyan: "36";
        readonly white: "37";
        readonly pink: "95";
    };
    constructor();
}
