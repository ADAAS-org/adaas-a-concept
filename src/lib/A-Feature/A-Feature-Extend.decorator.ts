import { A_Context } from "@adaas/a-concept/a-context";
import { A_Meta } from "@adaas/a-concept/a-meta";
import {
    A_TYPES__FeatureExtendDecoratorConfig,
    A_TYPES__FeatureExtendDecoratorDescriptor,
    A_TYPES__FeatureExtendDecoratorScopeItem,
    A_TYPES__FeatureExtendDecoratorTarget
} from "./A-Feature.types";
import { A_TYPES__ComponentMetaKey } from "@adaas/a-concept/a-component";
import { A_FeatureError } from "./A-Feature.error";
import { A_TypeGuards} from "@adaas/a-concept/helpers/A_TypeGuards.helper";
import { A_CommonHelper} from "@adaas/a-concept/helpers/A_Common.helper";
import { A_TYPES__EntityMetaKey } from "@adaas/a-concept/a-entity";
import { A_TYPES__ContainerMetaKey } from "@adaas/a-concept/a-container";




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
        const componentName = A_CommonHelper.getComponentName(target)

        if (!A_TypeGuards.isAllowedForFeatureExtension(target))
            throw new A_FeatureError(
                A_FeatureError.FeatureExtensionError,
                `A-Feature-Extend cannot be applied on the ${componentName} level`
            );

        let targetRegexp: RegExp;
        let behavior: 'sync' | 'async' = 'sync';
        let before: string = '';
        let after: string = '';
        let override: string = '';
        let include: Array<A_TYPES__FeatureExtendDecoratorScopeItem> = [];
        let exclude: Array<A_TYPES__FeatureExtendDecoratorScopeItem> = [];
        let throwOnError: boolean = true;
        let metaKey;


        switch (true) {
            case A_TypeGuards.isEntityInstance(target):
                metaKey = A_TYPES__EntityMetaKey.EXTENSIONS;
                break;
            case A_TypeGuards.isContainerInstance(target):
                metaKey = A_TYPES__ContainerMetaKey.EXTENSIONS
                break;
            case A_TypeGuards.isComponentInstance(target):
                metaKey = A_TYPES__ComponentMetaKey.EXTENSIONS
                break;
        }


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
                throwOnError = param1.throwOnError !== undefined ? param1.throwOnError : throwOnError;

                before = A_TypeGuards.isArray(param1.before)
                    ? new RegExp(`^${param1.before.join('|').replace(/\./g, '\\.')}$`).source
                    : param1.before instanceof RegExp
                        ? param1.before.source
                        : ''
                after = A_TypeGuards.isArray(param1.after)
                    ? new RegExp(`^${param1.after.join('|').replace(/\./g, '\\.')}$`).source
                    : param1.after instanceof RegExp
                        ? param1.after.source
                        : ''

                override = A_TypeGuards.isArray(param1.override)
                    ? new RegExp(`^${param1.override.join('|').replace(/\./g, '\\.')}$`).source
                    : param1.override instanceof RegExp
                        ? param1.override.source
                        : ''
                break;

            default:
                targetRegexp = new RegExp(`^.*${propertyKey.replace(/\./g, '\\.')}$`);
                break;
        }


        const existedDefinitions = A_Context
            .meta(target)
            .get(metaKey);

        // Get the existed metadata or create a new one
        const meta = A_Context.meta(target)

        const existedMeta = meta.get(metaKey)
            ? new A_Meta().from(meta.get(metaKey)!)
            : new A_Meta();

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

        const existedMetaValue = [
            ...(existedMeta.get(targetRegexp.source) || [])
        ];

        //  ensure that other regexps are preserved
        for (const [key, handlers] of existedMeta.entries()) {

            const indexInAnother = handlers.findIndex(item => item.handler === propertyKey);

            //  if the same handler exists in another regexp, remove it
            if (key !== targetRegexp.source && indexInAnother !== -1) {
                handlers.splice(indexInAnother, 1);
                //  if no handlers left for this regexp, remove the regexp entry
                if (handlers.length === 0) {
                    existedMeta.delete(key);
                } else {
                    existedMeta.set(key, handlers);
                }
            }
        }

        const existedIndex = existedMetaValue.findIndex(item => item.handler === propertyKey);

        const extension = {
            name: targetRegexp.source,
            handler: propertyKey,
            behavior,
            before,
            after,
            throwOnError,
            override
        }

        if (existedIndex !== -1) {
            // Update the existing method in the metadata
            existedMetaValue[existedIndex] = extension;
        } else {
            // Add the new method to the metadata
            existedMetaValue.push(extension);
        }



        // Set the metadata of the method to define a custom Feature with name
        existedMeta.set(targetRegexp.source, existedMetaValue);

        //  Update the metadata of the container with the new Feature definition
        A_Context
            .meta(target)
            .set(metaKey, existedMeta);
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