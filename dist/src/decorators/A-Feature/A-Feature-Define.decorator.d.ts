import { A_TYPES__A_FeatureDecoratorConfig, A_TYPES__A_FeatureDecoratorDescriptor } from "./A-Feature.decorator.types";
import { A_Entity } from "../../global/A-Entity/A-Entity.class";
import { A_Component } from "../../global/A-Component/A-Component.class";
import { A_Container } from "../../global/A-Container/A-Container.class";
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
export declare function A_Feature_Define(config?: Partial<A_TYPES__A_FeatureDecoratorConfig>): (target: A_Container | A_Entity | A_Component, propertyKey: string, descriptor: A_TYPES__A_FeatureDecoratorDescriptor) => A_TYPES__A_FeatureDecoratorDescriptor;
