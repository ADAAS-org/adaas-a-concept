import { A_Meta } from "../A-Meta/A-Meta.class";
import { A_TYPES__EntityMeta } from "./A-Entity.types";
import { A_TYPES__EntityMetaKey } from "./A-Entity.constants";
import { A_TYPES__FeatureDefineDecoratorMeta } from "../A-Feature/A-Feature.types";
import { A_TYPES__A_InjectDecorator_Meta } from "../A-Inject/A-Inject.types";


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


    /**
     * Allows to get all the injections for a given handler
     * 
     * @param handler 
     * @returns 
     */
    injections(
        handler: string
    ): A_TYPES__A_InjectDecorator_Meta {
        const injections = this.get(A_TYPES__EntityMetaKey.INJECTIONS);

        const args = injections?.get(handler) || [];

        return args;
    }

}