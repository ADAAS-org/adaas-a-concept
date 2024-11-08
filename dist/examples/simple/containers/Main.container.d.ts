import { A_Container } from "../../../src/global/A-Container/A-Container.class";
import { A_Scope } from "../../../src/global/A-Scope/A-Scope.class";
export declare class MainContainer extends A_Container<[
    'method_A',
    'method_B'
]> {
    load(): Promise<void>;
    start(scope: A_Scope): Promise<void>;
    method_A(): Promise<void>;
    method_B(): Promise<void>;
}
