import { A_Scope } from "../A-Scope/A-Scope.class";
/**
 * This element only contains the specific code
 *
 */
export declare class A_Component {
    constructor();
    call(
    /**
     * Name of the feature to call
     */
    feature: string, 
    /**
     * Scope in which the feature will be executed
     */
    scope?: A_Scope): Promise<any>;
}
