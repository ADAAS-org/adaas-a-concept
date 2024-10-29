import { A_Component } from "../../global/A-Component/A-Component.class";
import { A_TYPES__A_ExtendDecoratorConfig, A_TYPES__A_ExtendDecoratorDescriptor } from "./A-Feature.decorator.types";
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
export declare function A_Feature_Extend(config?: Partial<A_TYPES__A_ExtendDecoratorConfig>): (target: A_Component, propertyKey: string, descriptor: A_TYPES__A_ExtendDecoratorDescriptor) => void;
