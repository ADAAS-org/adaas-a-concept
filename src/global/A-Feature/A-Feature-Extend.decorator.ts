import { A_Component } from "@adaas/a-concept/global/A-Component/A-Component.class";
import { A_Context } from "@adaas/a-concept/global/A-Context/A-Context.class";
import { A_Meta } from "@adaas/a-concept/global/A-Meta/A-Meta.class";
import { A_TYPES__FeatureExtendDecoratorConfig, A_TYPES__FeatureExtendDecoratorDescriptor, A_TYPES__FeatureExtendDecoratorScopeItem, A_TYPES__FeatureExtendDecoratorTarget } from "./A-Feature.types";
import { A_TypeGuards } from "@adaas/a-concept/helpers/A_TypeGuards.helper";
import { A_TYPES__ComponentMetaKey } from "../A-Component/A-Component.constants";
import { A_FeatureError } from "./A-Feature.error";




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
    /**
     * The regular expression to match the name of the Feature method to be extended
     * 
     * Example:
     * 
     * ```ts
     *  @A_Feature.Extend(/.*\.load/)
     * ```
     */
    regexp: RegExp
)
/**
 * In this case the name configurations will be used as an input to get scope and name of target function
 * [!] Not that for all SCOPE will be used OR operator
 * 
 * @param config 
 */
export function A_Feature_Extend(
    /**
     * Configuration for the A-Feature-Extend decorator
     */
    config: Partial<A_TYPES__FeatureExtendDecoratorConfig>
)
/**
 * In this case the name of function will be used as a name of the Feature.
 * [!] AND it will be applicable for ANY element where the name is the same as the name of the function
 */
export function A_Feature_Extend()
export function A_Feature_Extend(
    param1?: Partial<A_TYPES__FeatureExtendDecoratorConfig> | RegExp
) {
    return function (
        target: A_TYPES__FeatureExtendDecoratorTarget,
        propertyKey: string,
        descriptor: A_TYPES__FeatureExtendDecoratorDescriptor
    ) {
        // for error messages
        const componentName = (target as any)?.constructor?.name || String(target) || 'Unknown';

        if (!A_TypeGuards.isAllowedForFeatureExtension(target))
            throw new A_FeatureError(
                A_FeatureError.FeatureExtensionError,
                `A-Feature-Extend cannot be applied on the ${componentName} level`
            );

        let targetRegexp: RegExp;
        let behavior: 'sync' | 'async' = 'sync';
        let before: string[] = [];
        let after: string[] = [];
        let include: Array<A_TYPES__FeatureExtendDecoratorScopeItem> = [];
        let exclude: Array<A_TYPES__FeatureExtendDecoratorScopeItem> = [];



        switch (true) {
            case A_TypeGuards.isRegExp(param1):
                targetRegexp = param1;
                break;

            case !!param1 && typeof param1 === 'object':

                if (Array.isArray(param1.scope))
                    include = param1.scope;
                else if (!!param1.scope && typeof param1.scope === 'object') {
                    if (Array.isArray(param1.scope.include))
                        include = param1.scope.include;
                    if (Array.isArray(param1.scope.exclude))
                        exclude = param1.scope.exclude;
                }


                targetRegexp = buildTargetRegexp(param1, include, exclude, propertyKey);

                behavior = param1.behavior || behavior;
                before = param1.before || before;
                after = param1.after || after;
                break;

            default:
                targetRegexp = new RegExp(`^.*\\.${propertyKey}$`);
                break;
        }


        const existedDefinitions = A_Context
            .meta(target)
            .get(A_TYPES__ComponentMetaKey.FEATURES);


        // Get the existed metadata or create a new one
        const existedMeta = A_Context
            .meta(target)
            .get(A_TYPES__ComponentMetaKey.EXTENSIONS)
            || new A_Meta();

        if (existedDefinitions
            && existedDefinitions.size()
            && existedDefinitions.has(propertyKey)
            && existedDefinitions.get(propertyKey)!.invoke
        ) {
            throw new A_FeatureError(
                A_FeatureError.FeatureExtensionError,
                `A-Feature-Extend cannot be used on the method "${propertyKey}" because it is already defined as a Feature with "invoke" set to true. Please remove the A-Feature-Extend decorator or set "invoke" to false in the A-Feature decorator.`
            );
        }

        const existedMetaValue = existedMeta.get(targetRegexp.source) || [];

        // Add the new method to the metadata
        existedMetaValue.push({
            name: targetRegexp.source,
            handler: propertyKey,
            behavior,
            before,
            after
        });

        // Set the metadata of the method to define a custom Feature with name
        existedMeta.set(targetRegexp.source, existedMetaValue);

        //  Update the metadata of the container with the new Feature definition
        A_Context
            .meta(target)
            .set(A_TYPES__ComponentMetaKey.EXTENSIONS, existedMeta);
    };
}


/**
 * Builds a target regular expression based on the provided parameters.
 * 
 * @param param1 - The first parameter, which can be a string or an object.
 * @param include - An array of items to include in the regular expression.
 * @param exclude - An array of items to exclude from the regular expression.
 * @param propertyKey - The property key to use in the regular expression.
 * @returns A regular expression object.
 */
export function buildTargetRegexp(
    param1: any,
    include: any[],
    exclude: any[],
    propertyKey: string
) {
    const includePart = include.length
        ? `(${include.map(el => el.name).join('|')})`
        : `.*`;

    const excludePart = exclude.length
        ? `(?!${exclude.map(el => el.name).join('|')})`
        : ``;

    const pattern = param1.scope
        ? `^${excludePart}${includePart}\\.${param1.name || propertyKey}$`
        : `.*\\.${param1.name || propertyKey}$`;

    return new RegExp(pattern);
}