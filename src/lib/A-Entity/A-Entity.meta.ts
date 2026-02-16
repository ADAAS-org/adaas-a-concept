import { A_Meta } from "@adaas/a-concept/a-meta";
import { A_TYPES__EntityMeta } from "./A-Entity.types";
import { A_TYPES__EntityMetaKey } from "./A-Entity.constants";
import { A_TYPES__FeatureDefineDecoratorMeta } from "@adaas/a-concept/a-feature";
import { A_TYPES__A_InjectDecorator_Meta } from "@adaas/a-concept/a-inject";


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