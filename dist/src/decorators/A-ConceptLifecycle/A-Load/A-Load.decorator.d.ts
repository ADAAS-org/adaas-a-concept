import { A_TYPES__A_LoadDecoratorConfig, A_TYPES__A_LoadDecoratorDescriptor } from "./A-Load.decorator.types";
import { A_Container } from "../../../global/A-Container/A-Container.class";
/**
 * A-Load decorator
 *
 * This Decorator allows to an extended flow of Concept loading.
 *
 * @param params
 * @returns
 */
export declare function A_Load(config?: Partial<A_TYPES__A_LoadDecoratorConfig>): (target: A_Container, propertyKey: string, descriptor: A_TYPES__A_LoadDecoratorDescriptor) => void;
