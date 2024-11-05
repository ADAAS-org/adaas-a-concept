import { A_TYPES__A_ExtendDecoratorConfig } from "./A-Feature.decorator.types";
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
export declare function A_Feature_Extend(regexp: RegExp): any;
/**
 * In this case the name configurations will be used as an input to get scope and name of target function
 * [!] Not that for all SCOPE will be used OR operator
 *
 * @param config
 */
export declare function A_Feature_Extend(config: Partial<A_TYPES__A_ExtendDecoratorConfig>): any;
/**
 * In this case the name of function will be used as a name of the Feature.
 * [!] AND it will be applicable for ANY element where the name is the same as the name of the function
 */
export declare function A_Feature_Extend(): any;
