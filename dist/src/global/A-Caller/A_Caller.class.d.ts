import { A_TYPES__FeatureAvailableComponents } from "../A-Feature/A-Feature.types";
/**
 * This is a common class that uses to return an entity that initiates a feature call
 *
 * It can be used then in @A_Inject(A_Caller) to get the entity that initiated the feature call
 *
 * [!] the class itself may be retrieved, but may require additional processing inside the feature
 *
 */
export declare class A_Caller<T extends A_TYPES__FeatureAvailableComponents = A_TYPES__FeatureAvailableComponents> {
    /**
     * The component that initiated the feature call
     */
    protected _component: T;
    /**
     * A_Caller allows to get the component that initiated the feature call
     *
     * It can be used then in @A_Inject(A_Caller) to get the entity that initiated the feature call
     *
     * [!] If Scope is not provided, a new empty scope will be created and inherited from the global scope
     *
     * @param component
     * @param scope
     */
    constructor(component: T);
    get component(): T;
    /**
     * Validates the provided parameters and Ensures that the component is of an allowed type
     *
     * @param component
     */
    protected validateParams(component: T): void;
}
