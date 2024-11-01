import { ContextFragmentB } from "../context/Fragment_B.context";
import { ContextFragmentA } from "../context/Fragment_A.context";
import { A_Component } from "../../../src/global/A-Component/A-Component.class";
import { A_Logger } from "../../../src/base/A-Logger/A-Logger.component";
export declare class ComponentB extends A_Component {
    private logger;
    constructor(logger: A_Logger);
    load(): Promise<void>;
    method_B(logger: A_Logger): Promise<void>;
    someMethod(): Promise<void>;
    someMethod2(): Promise<void>;
    someMethod3(context: ContextFragmentB, context2: ContextFragmentA): Promise<void>;
}
