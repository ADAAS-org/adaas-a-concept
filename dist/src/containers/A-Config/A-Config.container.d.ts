import { A_Container } from "../../global/A-Container/A-Container.class";
import { A_Config } from "./A-Config.namespace";
export declare class A_ConfigInitializer extends A_Container<A_Config> {
    private reader;
    identifyReader(): Promise<void>;
    readVariables(): Promise<void>;
}
