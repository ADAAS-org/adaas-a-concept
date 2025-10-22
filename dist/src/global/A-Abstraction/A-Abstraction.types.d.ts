import { A_Component } from "../A-Component/A-Component.class";
import { A_TYPES__ConceptAbstractions } from "../A-Concept/A-Concept.constants";
import { A_Container } from "../A-Container/A-Container.class";
import { A_TYPES__FeatureExtendDecoratorConfig } from "../A-Feature/A-Feature.types";
import { A_Abstraction } from "./A-Abstraction.class";
/**
 * Abstraction constructor type
 * Uses the generic type T to specify the type of the abstraction
 */
export type A_TYPES__Abstraction_Constructor<T = A_Abstraction> = new (...args: any[]) => T;
/**
 * Abstraction initialization type
 */
export type A_TYPES__Abstraction_Init = {
    /**
     * Name of the A-Abstraction
     */
    name: A_TYPES__ConceptAbstractions;
    /**
     * Features that compose the A-Abstraction
     */
    containers: Array<A_Container>;
};
/**
 * Abstraction serialized type
 */
export type A_TYPES__Abstraction_Serialized = {
    /**
     * The ASEID of the abstraction
     */
    aseid: string;
};
/**
 * Components that can extend Abstractions
 */
export type A_TYPES__AbstractionAvailableComponents = A_Component | A_Container;
export type A_TYPES__AbstractionDecoratorDescriptor = TypedPropertyDescriptor<() => any> | TypedPropertyDescriptor<(...args: any[]) => any> | TypedPropertyDescriptor<(...args: any[]) => Promise<any>> | TypedPropertyDescriptor<() => Promise<any>>;
export type A_TYPES__AbstractionDecoratorConfig = A_TYPES__FeatureExtendDecoratorConfig;
