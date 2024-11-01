import { A_Container } from "../../../src/global/A-Container/A-Container.class";
export declare class MainContainer extends A_Container<[
    'method_A',
    'method_B'
]> {
    load(): Promise<void>;
    start(params?: any): Promise<void>;
    method_A(): Promise<void>;
    method_B(): Promise<void>;
}
