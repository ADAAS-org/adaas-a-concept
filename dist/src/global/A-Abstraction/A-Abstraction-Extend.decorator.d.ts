import { A_TYPES__AbstractionDecoratorConfig, A_TYPES__AbstractionDecoratorDescriptor } from "./A-Abstraction.types";
import { A_Component } from "../A-Component/A-Component.class";
import { A_Container } from "../A-Container/A-Container.class";
import { A_TYPES__ConceptAbstractions } from "../A-Concept/A-Concept.constants";
/**
 * A-Abstraction Extend decorator allows to extends behavior of each concept abstraction execution.
 * In case some components or containers requires to extend the behavior of the abstraction like 'start', 'build' or 'deploy'
 * for example, this decorator allows to do so.
 *
 * @param name - abstraction name
 * @param config - configuration of the abstraction extension
 * @returns
 */
export declare function A_Abstraction_Extend(
/**
 * Name of the Concept Abstraction to extend
 */
name: A_TYPES__ConceptAbstractions, 
/**
 * Configuration of the Abstraction Extension
 *
 */
config?: Partial<A_TYPES__AbstractionDecoratorConfig>): (target: A_Container | A_Component, propertyKey: string, descriptor: A_TYPES__AbstractionDecoratorDescriptor) => void;
