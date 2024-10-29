import { A_TYPES__FeatureStep } from "../A-Feature/A-Feature.types";
import { A_Meta } from "../A-Meta/A-Meta.class";
import { A_Container } from "./A-Container.class";
import { A_TYPES__ContainerMeta } from "./A-Container.types";
export declare class A_ContainerMeta extends A_Meta<A_TYPES__ContainerMeta> {
    feature<T extends string>(container: A_Container<any>, name: T): A_TYPES__FeatureStep[];
}
