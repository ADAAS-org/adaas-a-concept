import { A_Component } from "../../../global/A-Component/A-Component.class";
import { A_Namespace } from "../../../global/A-Namespace/A_Namespace.class";
import { A_Error } from "@adaas/a-utils";
import { A_Config } from "src/containers/A-Config/A-Config.namespace";
export declare class Logger extends A_Component {
    protected namespace: A_Namespace;
    protected config: A_Config;
    constructor(namespace: A_Namespace, config: A_Config);
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
    get namespaceLength(): any;
    compile(color: keyof typeof this.colors, ...args: any[]): Array<string>;
    log(...args: any[]): void;
    warning(...args: any[]): void;
    error(...args: any[]): void;
    protected log_A_Error(error: A_Error): void;
    protected compile_A_Error(error: A_Error): string;
    protected compile_Error(error: Error): string;
    protected getTime(): string;
}
