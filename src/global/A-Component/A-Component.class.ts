import { A_Context } from "../A-Context/A-Context.class";
import { A_TYPES__ComponentConstructor } from "./A-Component.types";
import { A_TYPES__FeatureCallParams } from "../A-Feature/A-Feature.types";
import { A_Scope } from "../A-Scope/A-Scope.class";



/**
 * This element only contains the specific code
 * 
 */
export class A_Component {
    constructor() {
        console.log('A-Component instance created', this);

    }


    async call(
        /**
         * Name of the feature to call
         */
        feature: string,
        /**
         * Scope in which the feature will be executed
         */
        scope?: A_Scope,
    ) {
        scope = scope ? scope.inherit(A_Context.scope(this)) : A_Context.scope(this);

        const newFeature = A_Context.feature(this, feature, scope);

        return await newFeature.process();
    }
}



