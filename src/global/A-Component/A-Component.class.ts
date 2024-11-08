import { A_TYPES__Required } from "@adaas/a-utils";
import { A_Context } from "../A-Context/A-Context.class";
import { A_TYPES__ComponentCallParams } from "./A-Component.types";
import { A_Scope } from "../A-Scope/A-Scope.class";

/**
 * This element only contains the specific code
 * 
 */
export class A_Component<
    _FeatureNames extends Array<string> = any,
> {


    /**
     * Call a feature of the component
     * 
     * @param lifecycleMethod 
     * @param args 
     */
    async call(
        scope: A_Scope,
        /**
         * A-Feature method name to be called
         */
        feature: _FeatureNames[number],
    ): Promise<any>
    async call(
        scope: A_Scope,
        /**
         * A-Feature name to be called
         */
        params: A_TYPES__Required<Partial<A_TYPES__ComponentCallParams<_FeatureNames[number]>>, ['name']>,
    ): Promise<any>

    async call(
        scope: A_Scope,
        /**
        * A-Feature method name to be called
        */
        feature: string,
        /**
         * Parameters to provide additional data to the feature
         */
        params: Partial<A_TYPES__ComponentCallParams<_FeatureNames[number]>>,
    ): Promise<any>

    async call(
        scope: A_Scope,
        param1: _FeatureNames[number] | A_TYPES__Required<Partial<A_TYPES__ComponentCallParams<_FeatureNames[number]>>, ['name']>,
        param2?: Partial<A_TYPES__ComponentCallParams<_FeatureNames[number]>>
    ): Promise<any> {

        const feature: string = typeof param1 === 'string'
            ? param1
            : param1.name;
        const params: Partial<A_TYPES__ComponentCallParams<_FeatureNames[number]>> = typeof param1 === 'string'
            ? param2 || {}
            : param1;

        const newFeature = A_Context.feature(scope, this, feature, params);

        return await newFeature.process();
    }
}