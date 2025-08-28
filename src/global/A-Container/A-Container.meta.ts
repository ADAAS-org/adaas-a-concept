import { A_TYPES__A_InjectDecorator_Meta } from "@adaas/a-concept/decorators/A-Inject/A-Inject.decorator.types";
import { A_TYPES__ConceptAbstractionMeta, A_TYPES__ConceptStage } from "../A-Concept/A_Concept.types";
import { A_Meta } from "../A-Meta/A-Meta.class";
import {
    A_TYPES__ContainerMeta,
    A_TYPES__ContainerMetaKey
} from "./A-Container.types";
import { A_TYPES__A_DefineDecorator_Meta } from "@adaas/a-concept/decorators/A-Feature/A-Feature.decorator.types";



export class A_ContainerMeta extends A_Meta<A_TYPES__ContainerMeta> {



    /**
     * Allows to get all the injections for a given handler
     * 
     * @param handler 
     * @returns 
     */
    injections(
        handler: string
    ): A_TYPES__A_InjectDecorator_Meta {
        const injections = this.get(A_TYPES__ContainerMetaKey.INJECTIONS);

        const args = injections?.get(handler) || [];

        return args;
    }

    /**
     * Returns all features defined in the Container
     * 
     * @returns 
     */
    features(): Array<A_TYPES__A_DefineDecorator_Meta> {

        const features = this.get(A_TYPES__ContainerMetaKey.FEATURES);

        return features?.toArray()
            // returns all extensions that match the feature
            .map(([, feature]) => feature) || [];
    }

    /**
     * Returns a set of instructions to run proper methods in Container during A-Concept Stage
     * 
     * @param stage 
     * @returns 
     */
    abstractions(
        abstraction: A_TYPES__ConceptStage
    ): A_TYPES__ConceptAbstractionMeta[] {
        const steps: A_TYPES__ConceptAbstractionMeta[] = [];

        const abstractions = this.get(A_TYPES__ContainerMetaKey.ABSTRACTIONS);
        const injections = this.get(A_TYPES__ContainerMetaKey.INJECTIONS);

        // const constructor = A_Context.component(this);


        abstractions
            // returns all extensions that match the feature
            ?.find(`CONCEPT_ABSTRACTION::${abstraction}`)
            .forEach(([handler, extensions]) => {
                extensions.forEach(extension => {
                    const args = injections?.get(extension.handler) || [];

                    steps.push({
                        name: extension.name,
                        handler: extension.handler,
                        args,
                        before: extension.before,
                        behavior: extension.behavior,
                        after: extension.after
                    });

                });
            });


        return steps;
    }

}