import { ContextFragmentA } from "../context/Fragment_A.context";
import { ContextFragmentB } from "../context/Fragment_B.context";
export declare class ComponentA {
    load(): Promise<void>;
    method_A(fragmentA: ContextFragmentA): Promise<void>;
    someMethod(fragmentB: ContextFragmentB): Promise<void>;
}
