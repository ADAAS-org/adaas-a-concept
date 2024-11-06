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
                        args
                    });

                });
            });


        return steps;
    }

}