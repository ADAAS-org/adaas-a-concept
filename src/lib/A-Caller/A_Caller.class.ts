import { A_TypeGuards} from "@adaas/a-concept/helpers/A_TypeGuards.helper";
import { A_TYPES__FeatureAvailableComponents } from "@adaas/a-concept/a-feature";
import { A_CallerError } from "./A_Caller.error";



/**
 * This is a common class that uses to return an entity that initiates a feature call
 * 
 * It can be used then in @A_Inject(A_Caller) to get the entity that initiated the feature call
 * 
 * [!] the class itself may be retrieved, but may require additional processing inside the feature
 * 
 */
export class A_Caller<T extends A_TYPES__FeatureAvailableComponents = A_TYPES__FeatureAvailableComponents> {

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
    constructor(
        component: T
    ) {
        this.validateParams(component);

        this._component = component;
    }

    get component(): T {
        return this._component;
    }


    /**
     * Validates the provided parameters and Ensures that the component is of an allowed type
     * 
     * @param component 
     */
    protected validateParams(
        component: T
    ) {
        if (!A_TypeGuards.isAllowedForFeatureCall(component)) {
            throw new A_CallerError(
                `[${A_CallerError.CallerInitializationError}]: Invalid A-Caller component provided of type: ${typeof component} with value: ${JSON.stringify(component).slice(0, 100)}...`
            );
        }
    }
}