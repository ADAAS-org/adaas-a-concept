import { A_Meta } from "../A-Meta/A-Meta.class";
import { A_TYPES__EntityMeta } from "./A-Entity.types";
import { A_TYPES__FeatureDefineDecoratorMeta } from "../A-Feature/A-Feature.types";
export declare class A_EntityMeta extends A_Meta<A_TYPES__EntityMeta> {
    /**
     * Returns all features defined in the Container
     *
     * @returns
     */
    features(): Array<A_TYPES__FeatureDefineDecoratorMeta>;
}
