import { A_Container } from "../../global/A-Container/A-Container.class";
export declare class A_ConfigLoader extends A_Container<['load', 'read']> {
    private reader;
    identifyReader(): Promise<void>;
    readVariables(): Promise<void>;
}
