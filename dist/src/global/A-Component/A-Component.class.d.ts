import { A_TYPES__Required } from "@adaas/a-utils";
import { A_TYPES__ComponentCallParams, A_TYPES__ComponentConstructor } from "./A-Component.types";
import { A_Scope } from "../A-Scope/A-Scope.class";
/**
 * This element only contains the specific code
 *
 */
export declare class A_Component<_FeatureNames extends Array<string> = any> {
    constructor(params?: Partial<A_TYPES__ComponentConstructor<_FeatureNames>>);
    /**
     * Call a feature of the component
     *
     * @param lifecycleMethod
     * @param args
     */
    call(scope: A_Scope, 
    /**
     * A-Feature method name to be called
     */
    feature: _FeatureNames[number]): Promise<any>;
    call(scope: A_Scope, 
    /**
     * A-Feature name to be called
     */
    params: A_TYPES__Required<Partial<A_TYPES__ComponentCallParams<_FeatureNames[number]>>, ['name']>): Promise<any>;
    call(scope: A_Scope, 
    /**
    * A-Feature method name to be called
    */
    feature: string, 
    /**
     * Parameters to provide additional data to the feature
     */
    params: Partial<A_TYPES__ComponentCallParams<_FeatureNames[number]>>): Promise<any>;
}
