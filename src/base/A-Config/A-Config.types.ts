import { A_TYPES__FragmentConstructor } from "@adaas/a-concept/global/A-Fragment/A-Fragment.types";


export enum A_TYPES__ConfigFeature {

}


export type A_TYPES__ConfigContainerConstructor<T extends string> = {
    
    /**
     * If set to true, the SDK will throw an error if the variable is not defined OR not presented in the defaults
     */
    strict: boolean

    /**
     * Allows to define the names of variable to be loaded
     */
    variables: Array<T>

    /**
     * Allows to set the default values for the variables
     */
    defaults: {
        [key in T]?: any
    }

    // credentials?: {
    //     /**
    //      * Api Credentials Client ID to authenticate the SDK
    //      * can be skipped for the FrontEnd SDKs
    //      */
    //     client_id: string,

    //     /**
    //      * Api Credentials Client Secret to authenticate the SDK
    //      * can be skipped for the FrontEnd SDKs
    //      */
    //     client_secret: string

    // }
} & A_TYPES__FragmentConstructor;


export type A_TYPES__ConfigContainer_DefaultProperties = 'CONFIG_SDK_VALIDATION'
    | 'CONFIG_VERBOSE'
    | 'CONFIG_IGNORE_ERRORS';