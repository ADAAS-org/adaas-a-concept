import { A_TYPES__ComponentMetaKey } from "../A-Component/A-Component.types";
import { A_Context } from "../A-Context/A-Context.class";
import { A_TYPES__FeatureStep } from "../A-Feature/A-Feature.types";
import { A_Meta } from "../A-Meta/A-Meta.class";
import { A_Container } from "./A-Container.class";
import {
    A_TYPES__ContainerMeta,
    A_TYPES__ContainerMetaKey
} from "./A-Container.types";



export class A_ContainerMeta extends A_Meta<A_TYPES__ContainerMeta> {


    feature<T extends string>(
        container: A_Container<any>,
        name: T,
        // params:
    ) {
        const scope = A_Context.scope(container);

        // First lets validate that there'are registered method with the same name
        const featureMeta = this.get(A_TYPES__ContainerMetaKey.FEATURES);

        if (!featureMeta) {
            throw new Error(`Container ${container.constructor.name} has no metadata defined`);
        }

        const instruction = featureMeta.get(name);

        if (!instruction)
            throw new Error(`Method ${name} is not defined in ${this.constructor.name}`);

        // const scope = new A_Scope({
        //     name: `${this.constructor.name}.${feature}`,
        //     fragments: param2?.fragments || [],
        //     components: param2?.components || []
        // }, {
        //     parent: this.scope
        // });


        // Now we need to resolve the method from all registered components 
        return scope
            .components
            .reduce((
                acc, component
            ) => {
                const componentMeta = A_Context.meta(component);

                const extensions = componentMeta.get(A_TYPES__ComponentMetaKey.EXTENSIONS) || [];
                const injections = componentMeta.get(A_TYPES__ComponentMetaKey.INJECTIONS);

                const out: A_TYPES__FeatureStep[] = [];

                extensions.forEach((extension, handler) => {
                    if (
                        extension.name === name
                        &&
                        (extension.container === container.constructor.name || extension.container === '*')
                    ) {
                        const args = injections?.get(handler) || [];

                        out.push({
                            component,
                            handler,
                            args
                        });
                    }
                });

                return [
                    ...acc,
                    ...out
                ];

            }, [] as A_TYPES__FeatureStep[])
    }
}