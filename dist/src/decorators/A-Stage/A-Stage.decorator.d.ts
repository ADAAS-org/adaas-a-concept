import { A_TYPES__A_StageDecoratorConfig, A_TYPES__A_StageDecoratorDescriptor } from "./A-Stage.decorator.types";
import { A_Container } from "../../global/A-Container/A-Container.class";
import { A_TYPES__ConceptStage } from "../../global/A-Concept/A_Concept.types";
/**
 * A_Stage Decorator uses to extend basic A-Concept Stage methods inside Containers.
 *
 * Using this decorator you can define extend a logic and sequence of the Container Stage methods execution.
 *
 * @param params
 * @returns
 */
export declare function A_Stage(method: A_TYPES__ConceptStage): (config?: Partial<A_TYPES__A_StageDecoratorConfig>) => (target: A_Container<any>, propertyKey: string, descriptor: A_TYPES__A_StageDecoratorDescriptor) => void;
