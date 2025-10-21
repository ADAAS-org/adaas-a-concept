import { A_TYPES__FeatureDefineDecoratorConfig, A_TYPES__FeatureDefineDecoratorDescriptor, A_TYPES__FeatureDefineDecoratorTarget } from "./A-Feature.types";
/**
 * A-Feature decorator
 *
 * This decorator allows to define a custom lifecycle stage for the Container.
 * These stages are executed in a container-specific order and can be extended by components that are injected into the container.
 * This approach allows to create a flexible and extendable architecture for the application.
 *
 * The main difference between the A-Feature and A-Feature decorators is that A-Feature methods can be inherited and overridden by child classes.
 *
 *
 * @param params
 * @returns
 */
export declare function A_Feature_Define(config?: Partial<A_TYPES__FeatureDefineDecoratorConfig>): (target: A_TYPES__FeatureDefineDecoratorTarget, propertyKey: string, descriptor: A_TYPES__FeatureDefineDecoratorDescriptor) => A_TYPES__FeatureDefineDecoratorDescriptor;
