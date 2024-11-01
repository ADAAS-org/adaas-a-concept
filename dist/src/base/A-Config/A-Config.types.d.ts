import { A_TYPES__FragmentConstructor } from "../../global/A-Fragment/A-Fragment.types";
export declare enum A_TYPES__ConfigFeature {
}
export type A_TYPES__ConfigContainerConstructor<T extends string> = {
    /**
     * Allows to define the names of variable to be loaded
     */
    variables: Array<T>;
    /**
     * Allows to set the default values for the variables
     */
    defaults: {
        [key in T]?: any;
    };
} & A_TYPES__FragmentConstructor;
export type A_TYPES__ConfigContainer_DefaultProperties = 'CONFIG_SDK_VALIDATION' | 'CONFIG_VERBOSE' | 'CONFIG_IGNORE_ERRORS';
