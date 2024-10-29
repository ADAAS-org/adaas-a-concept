import { ContextFragmentB } from "../context/Fragment_B.context";
import { ContextFragmentA } from "../context/Fragment_A.context";
export declare class ComponentB {
    load(): Promise<void>;
    method_B(): Promise<void>;
    someMethod(): Promise<void>;
    someMethod2(): Promise<void>;
    someMethod3(context: ContextFragmentB, context2: ContextFragmentA): Promise<void>;
}
