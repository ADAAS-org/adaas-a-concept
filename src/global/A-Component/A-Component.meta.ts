import { A_TYPES__A_InjectDecorator_Meta } from "@adaas/a-concept/global/A-Inject/A-Inject.types";
import { A_TYPES__ConceptAbstractionMeta } from "../A-Concept/A-Concept.types";
import { A_Meta } from "../A-Meta/A-Meta.class";
import { A_TYPES__ComponentMeta, A_TYPES__ComponentMetaExtension } from "./A-Component.types";
import { A_TYPES__ComponentMetaKey } from "./A-Component.constants";
import { A_TYPES__FeatureDefineDecoratorMeta } from "../A-Feature/A-Feature.types";


export class A_ComponentMeta extends A_Meta<A_TYPES__ComponentMeta> {

    /**
     * Allows to get all the injections for a given handler
     * 
     * @param handler 
     * @returns 
     */
    injections(
        handler: string
    ): A_TYPES__A_InjectDecorator_Meta {
        const injections = this.get(A_TYPES__ComponentMetaKey.INJECTIONS);

        const args = injections?.get(handler) || [];

        return args;
    }

    /**
     * Allows to get all the extensions for a given feature
     * 
     * @param feature 
     * @returns 
     */
    extensions(
        feature: string
    ): A_TYPES__ComponentMetaExtension[] {
        const steps: A_TYPES__ComponentMetaExtension[] = [];

        const extensions = this.get(A_TYPES__ComponentMetaKey.EXTENSIONS);

        extensions
            // returns all extensions that match the feature
            ?.find(feature)
            .forEach(([handler, extensions]) => {
                extensions.forEach(extension => {
                    steps.push({
                        // component: constructor,
                        name: extension.name,
                        handler: extension.handler,
                        behavior: extension.behavior,
                        before: extension.before || [],
                        after: extension.after || []
                    });

                });
            });


        return steps;
    }

    /**
     * Returns all features defined in the Component
     * 
     * @returns 
     */
    features(): Array<A_TYPES__FeatureDefineDecoratorMeta> {

        const features = this.get(A_TYPES__ComponentMetaKey.FEATURES);

        return features?.toArray()
            // returns all extensions that match the feature
            .map(([, feature]) => feature) || [];
    }

    /**
     * Returns a set of instructions to run proper methods in Component during A-Concept Stage
     * 
     * @param stage 
     * @returns 
     */
    abstractions(
        abstraction: any
    ): A_TYPES__ConceptAbstractionMeta[] {
        const steps: A_TYPES__ConceptAbstractionMeta[] = [];

        const abstractions = this.get(A_TYPES__ComponentMetaKey.ABSTRACTIONS);
        const injections = this.get(A_TYPES__ComponentMetaKey.INJECTIONS);

        abstractions
            // returns all extensions that match the feature
            ?.find(abstraction)
            .forEach(([handler, extensions]) => {
                extensions.forEach(extension => {
                    const args = injections?.get(extension.handler) || [];

                    steps.push({
                        ...extension,
                        // component: constructor,
                        args,
                    });

                });
            });


        return steps;
    }
}