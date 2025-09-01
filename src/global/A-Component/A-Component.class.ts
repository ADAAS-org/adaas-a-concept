import { A_Context } from "../A-Context/A-Context.class";
import { A_TYPES__ComponentConstructor } from "./A-Component.types";
import { A_TYPES__FeatureCallParams } from "../A-Feature/A-Feature.types";



/**
 * This element only contains the specific code
 * 
 */
export class A_Component {
    constructor(
        params?: Partial<A_TYPES__ComponentConstructor<any>>
    ) { 
        console.log('A-Component instance created', this);

    }


    async call(
        feature: string,
        params: Partial<A_TYPES__FeatureCallParams> = {}
    ) {
        const newFeature = A_Context.feature(A_Context.scope(this), this, feature, params);

        return await newFeature.process();
    }


}



