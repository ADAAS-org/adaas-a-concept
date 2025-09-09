import { A_TYPES__A_InjectDecorator_Meta } from "@adaas/a-concept/decorators/A-Inject/A-Inject.decorator.types";
import { A_Meta } from "../A-Meta/A-Meta.class";
import { A_TYPES__EntityMeta, A_TYPES__EntityMetaKey } from "./A-Entity.types";
import { A_TYPES__A_DefineDecorator_Meta } from "@adaas/a-concept/decorators/A-Feature/A-Feature.decorator.types";


export class A_EntityMeta extends A_Meta<A_TYPES__EntityMeta> {

    /**
     * Returns all features defined in the Container
     * 
     * @returns 
     */
    features(): Array<A_TYPES__A_DefineDecorator_Meta> {

        const features = this.get(A_TYPES__EntityMetaKey.FEATURES);

        return features?.toArray()
            // returns all extensions that match the feature
            .map(([, feature]) => feature) || [];
    }

}