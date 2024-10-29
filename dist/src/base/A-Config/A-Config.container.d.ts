import { A_Container } from "../../global/A-Container/A-Container.class";
import { A_Logger } from "../A-Logger/A-Logger.component";
import { A_Scope } from "../../global/A-Scope/A-Scope.class";
export declare class A_ConfigLoader extends A_Container<['load', 'read']> {
    private reader;
    identifyReader(scope: A_Scope, logger: A_Logger): Promise<void>;
    readVariables(): Promise<void>;
}
