import { A_TYPES__ConceptAbstractionMeta, A_TYPES__ConceptStage } from "../A-Concept/A_Concept.types";
import { A_Meta } from "../A-Meta/A-Meta.class";
import { A_TYPES__ComponentMeta, A_TYPES__ComponentMetaExtension, A_TYPES__ComponentMetaKey } from "./A-Component.types";


export class A_ComponentMeta extends A_Meta<A_TYPES__ComponentMeta> {




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
        const injections = this.get(A_TYPES__ComponentMetaKey.INJECTIONS);

        // const constructor = A_Context.component(this);


        extensions
            // returns all extensions that match the feature
            ?.find(feature)
            .forEach(([handler, extensions]) => {
                extensions.forEach(extension => {
                    const args = injections?.get(extension.handler) || [];

                    steps.push({
                        // component: constructor,
                        name: extension.name,
                        handler: extension.handler,
                        args,
                        behavior: extension.behavior,
                        before: extension.before || [],
                        after: extension.after || []
                    });

                });
            });


        return steps;
    }


    /**
     * Returns a set of instructions to run proper methods in Component during A-Concept Stage
     * 
     * @param stage 
     * @returns 
     */
    abstractions(
        abstraction: A_TYPES__ConceptStage
    ): A_TYPES__ConceptAbstractionMeta[] {
        const steps: A_TYPES__ConceptAbstractionMeta[] = [];

        const abstractions = this.get(A_TYPES__ComponentMetaKey.ABSTRACTIONS);
        const injections = this.get(A_TYPES__ComponentMetaKey.INJECTIONS);

        // const constructor = A_Context.component(this);


        abstractions
            // returns all extensions that match the feature
            ?.find(`CONCEPT_ABSTRACTION::${abstraction}`)
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