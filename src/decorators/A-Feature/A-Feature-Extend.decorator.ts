import { A_Component } from "@adaas/a-concept/global/A-Component/A-Component.class";
import {
    A_TYPES__A_ExtendDecoratorConfig,
    A_TYPES__A_ExtendDecoratorDescriptor,
} from "./A-Feature.decorator.types";
import { A_TYPES__ComponentMetaKey } from "@adaas/a-concept/global/A-Component/A-Component.types";
import { A_Context } from "@adaas/a-concept/global/A-Context/A-Context.class";
import { A_Container } from "@adaas/a-concept/global/A-Container/A-Container.class";
import { A_Entity } from "@adaas/a-concept/global/A-Entity/A-Entity.class";
import { A_Meta } from "@adaas/a-concept/global/A-Meta/A-Meta.class";




/**
 * A-Extend decorator
 * 
 * This decorator allows to define a custom Extend stage for the Container.
 * These stages are executed in a container-specific order and can be extended by components that are injected into the container.
 * This approach allows to create a flexible and extendable architecture for the application.
 * 
 * The main difference between the A-Extend and A-Extend decorators is that A-Extend methods can be inherited and overridden by child classes.
 * 
 * 
 * @param params 
 * @returns 
 */
/**
 * Use regexp in case if you need more flexibility and control over the name of the method
 * 
 * @param regexp 
 */
export function A_Feature_Extend(
    regexp: RegExp
)
/**
 * In this case the name configurations will be used as an input to get scope and name of target function
 * [!] Not that for all SCOPE will be used OR operator
 * 
 * @param config 
 */
export function A_Feature_Extend(
    config: Partial<A_TYPES__A_ExtendDecoratorConfig>
)
/**
 * In this case the name of function will be used as a name of the Feature.
 * [!] AND it will be applicable for ANY element where the name is the same as the name of the function
 */
export function A_Feature_Extend()
export function A_Feature_Extend(
    param1?: Partial<A_TYPES__A_ExtendDecoratorConfig> | RegExp
) {
    return function (
        target: A_Component,
        propertyKey: string,
        descriptor: A_TYPES__A_ExtendDecoratorDescriptor
    ) {

        let targetRegexp: RegExp;


        // Check if the config is a RegExp
        if (param1 instanceof RegExp) {
            targetRegexp = param1;
        }
        else if (!!param1) {
            targetRegexp = new RegExp(`^(${(param1.scope || [])
                    .map(el => el.name)
                    .join('|')
                })\.${param1.name || propertyKey}$`);
        }
        else {
            targetRegexp = new RegExp(`^.*\\.${propertyKey}$`);
        }

        // Get the existed metadata or create a new one
        const existedMeta = A_Context
            .meta(target)
            .get(A_TYPES__ComponentMetaKey.EXTENSIONS)
            || new A_Meta();


        const existedMetaValue = existedMeta.get(targetRegexp.source) || [];

        // Add the new method to the metadata
        existedMetaValue.push({
            name: targetRegexp.source,
            handler: propertyKey,
        });

        // Set the metadata of the method to define a custom Feature with name
        existedMeta.set(targetRegexp.source, existedMetaValue);

        //  Update the metadata of the container with the new Feature definition
        A_Context
            .meta(target)
            .set(A_TYPES__ComponentMetaKey.EXTENSIONS, existedMeta);
    };
}

