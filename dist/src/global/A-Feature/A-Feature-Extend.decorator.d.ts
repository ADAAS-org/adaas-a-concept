import { A_TYPES__FeatureExtendDecoratorConfig } from "./A-Feature.types";
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
export declare function A_Feature_Extend(
/**
 * The regular expression to match the name of the Feature method to be extended
 *
 * Example:
 *
 * ```ts
 *  @A_Feature.Extend(/.*\.load/)
 * ```
 */
regexp: RegExp): any;
/**
 * In this case the name configurations will be used as an input to get scope and name of target function
 * [!] Not that for all SCOPE will be used OR operator
 *
 * @param config
 */
export declare function A_Feature_Extend(
/**
 * Configuration for the A-Feature-Extend decorator
 */
config: Partial<A_TYPES__FeatureExtendDecoratorConfig>): any;
/**
 * In this case the name of function will be used as a name of the Feature.
 * [!] AND it will be applicable for ANY element where the name is the same as the name of the function
 */
export declare function A_Feature_Extend(): any;
/**
 * Builds a target regular expression based on the provided parameters.
 *
 * @param param1 - The first parameter, which can be a string or an object.
 * @param include - An array of items to include in the regular expression.
 * @param exclude - An array of items to exclude from the regular expression.
 * @param propertyKey - The property key to use in the regular expression.
 * @returns A regular expression object.
 */
export declare function buildTargetRegexp(param1: any, include: any[], exclude: any[], propertyKey: string): RegExp;
