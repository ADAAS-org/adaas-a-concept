import { A_Feature } from "./Feature/Feature.decorator";
import { A_Lifecycle } from "./Lifecycle/Lifecycle.decorator";
export interface A_IDefine {
    Lifecycle: typeof A_Lifecycle;
    Feature: typeof A_Feature;
}
export declare const A_Define: A_IDefine;
