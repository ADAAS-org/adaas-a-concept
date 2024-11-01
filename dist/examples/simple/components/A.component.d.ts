import { ContextFragmentA } from "../context/Fragment_A.context";
import { ContextFragmentB } from "../context/Fragment_B.context";
import { A_Component } from "../../../src/global/A-Component/A-Component.class";
import { A_Logger } from "../../../src/base/A-Logger/A-Logger.component";
export declare class ComponentA extends A_Component {
    load(): Promise<void>;
    method_A(fragmentA: ContextFragmentA, logger: A_Logger): Promise<void>;
    someMethod(fragmentB: ContextFragmentB): Promise<void>;
}
