import { A_Meta } from "../A-Meta/A-Meta.class";
import { A_TYPES__ComponentMeta, A_TYPES__ComponentMetaExtension } from "./A-Component.types";
export declare class A_ComponentMeta extends A_Meta<A_TYPES__ComponentMeta> {
    /**
     * Allows to get all the extensions for a given feature
     *
     * @param feature
     * @returns
     */
    extensions(feature: string): A_TYPES__ComponentMetaExtension[];
}
