import { A_Component } from "../../global/A-Component/A-Component.class";
import { A_TYPES__A_AbstractionDecoratorDescriptor } from "./A-Abstraction.decorator.types";
import { A_Container } from "../../global/A-Container/A-Container.class";
import { A_TYPES__ConceptStage } from "../../global/A-Concept/A_Concept.types";
import { A_TYPES__A_ExtendDecoratorConfig } from "../A-Feature/A-Feature.decorator.types";
/**
 * A_Stage Decorator uses to extend basic A-Concept Stage methods inside Containers.
 *
 * Using this decorator you can define extend a logic and sequence of the Container Stage methods execution.
 *
 * @param params
 * @returns
 */
export declare function A_Abstraction_Extend(method: A_TYPES__ConceptStage, config?: Partial<A_TYPES__A_ExtendDecoratorConfig>): (target: A_Container | A_Component, propertyKey: string, descriptor: A_TYPES__A_AbstractionDecoratorDescriptor) => void;
