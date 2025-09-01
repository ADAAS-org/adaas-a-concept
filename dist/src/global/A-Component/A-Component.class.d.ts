import { A_TYPES__ComponentConstructor } from "./A-Component.types";
import { A_TYPES__FeatureCallParams } from "../A-Feature/A-Feature.types";
/**
 * This element only contains the specific code
 *
 */
export declare class A_Component {
    constructor(params?: Partial<A_TYPES__ComponentConstructor<any>>);
    call(feature: string, params?: Partial<A_TYPES__FeatureCallParams>): Promise<any>;
}
