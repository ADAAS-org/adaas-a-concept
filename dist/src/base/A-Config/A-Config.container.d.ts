import { A_Container } from "../../global/A-Container/A-Container.class";
import { A_Scope } from "../../global/A-Scope/A-Scope.class";
import { A_Config } from "./A-Config.context";
import { A_TYPES__ContainerConstructor } from "../../global/A-Container/A-Container.types";
export declare class A_ConfigLoader extends A_Container {
    private reader;
    constructor(params: Partial<A_TYPES__ContainerConstructor<['load', 'read']>>);
    prepare(config: A_Config): Promise<void>;
    readVariables(config: A_Config, scope: A_Scope): Promise<void>;
}
