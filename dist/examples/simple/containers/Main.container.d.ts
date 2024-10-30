import { A_Container } from "../../../src/global/A-Container/A-Container.class";
import { A_Feature } from "../../../src/global/A-Feature/A-Feature.class";
export declare class MainContainer extends A_Container<[
    'method_A',
    'method_B'
]> {
    load(): Promise<void>;
    start(params?: any): Promise<void>;
    method_A(): Promise<void>;
    method_B(): Promise<A_Feature>;
}
