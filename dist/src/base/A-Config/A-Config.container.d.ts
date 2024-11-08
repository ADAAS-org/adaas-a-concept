import { A_Container } from "../../global/A-Container/A-Container.class";
import { A_Config } from "./A-Config.context";
export declare class A_ConfigLoader extends A_Container<['load', 'read']> {
    private reader;
    prepare(config: A_Config): Promise<void>;
    readVariables(config: A_Config): Promise<void>;
}
