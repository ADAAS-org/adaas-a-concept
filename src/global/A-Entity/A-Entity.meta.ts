import { A_Meta } from "../A-Meta/A-Meta.class";
import { A_TYPES__EntityMeta } from "./A-Entity.types";
import { A_TYPES__EntityMetaKey } from "./A-Entity.constants";
import { A_TYPES__FeatureDefineDecoratorMeta } from "../A-Feature/A-Feature.types";


export class A_EntityMeta extends A_Meta<A_TYPES__EntityMeta> {

    /**
     * Returns all features defined in the Container
     * 
     * @returns 
     */
    features(): Array<A_TYPES__FeatureDefineDecoratorMeta> {

        const features = this.get(A_TYPES__EntityMetaKey.FEATURES);

        return features?.toArray()
            // returns all extensions that match the feature
            .map(([, feature]) => feature) || [];
    }

}