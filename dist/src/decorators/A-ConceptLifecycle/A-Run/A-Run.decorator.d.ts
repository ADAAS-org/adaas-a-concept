import { A_TYPES__A_RunDecoratorConfig, A_TYPES__A_RunDecoratorDescriptor } from "./A-Run.decorator.types";
import { A_Container } from "../../../global/A-Container/A-Container.class";
/**
 * A-Run decorator
 *
 * This decorator is used to define a method that will be executed during the lifecycle of the module.
 * Depending on the definition and configurations
 * it will be executed during the run command
 * modifying and adjusting the whole [root.run] pipeline.
 *
 * This decorator can be used in case of the need to define a custom logic that will be executed during the run command.
 *
 *
 * @param params
 * @returns
 */
export declare function A_Run(config?: Partial<A_TYPES__A_RunDecoratorConfig>): (target: A_Container, propertyKey: string, descriptor: A_TYPES__A_RunDecoratorDescriptor) => void;
