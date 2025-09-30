import { A_TYPES__ConceptENVVariables } from "../../constants/env.constants";
import { A_TYPES__FragmentConstructor } from "../../global/A-Fragment/A-Fragment.types";
export declare enum A_TYPES__ConfigFeature {
}
export type A_TYPES__ConfigContainerConstructor<T extends Array<string | A_TYPES__ConceptENVVariables[number]>> = {
    /**
     * If set to true, the SDK will throw an error if the variable is not defined OR not presented in the defaults
     */
    strict: boolean;
    /**
     * Allows to define the names of variable to be loaded
     */
    variables: T;
    /**
     * Allows to set the default values for the variables
     */
    defaults: {
        [key in T[number]]?: any;
    };
} & A_TYPES__FragmentConstructor;
