import { A_Container } from "../../global/A-Container/A-Container.class";
import { A_LoggerContext } from "./A-Logger.namespace";
import { A_Config } from "../A-Config/A-Config.namespace";
export declare class A_Logger extends A_Container<A_LoggerContext> {
    init(config: A_Config): Promise<void>;
}
