import { A_Meta } from "../A-Meta/A-Meta.class";
import { A_TYPES__CommandMeta, A_TYPES__CommandMetaKey } from "./A-Command.types";
import { A_TYPES__A_DefineDecorator_Meta } from "@adaas/a-concept/decorators/A-Feature/A-Feature.decorator.types";


export class A_CommandMeta extends A_Meta<A_TYPES__CommandMeta> {

    /**
     * Returns all features defined in the Container
     * 
     * @returns 
     */
    features(): Array<A_TYPES__A_DefineDecorator_Meta> {

        const features = this.get(A_TYPES__CommandMetaKey.FEATURES);

        return features?.toArray()
            // returns all extensions that match the feature
            .map(([, feature]) => feature) || [];
    }

}