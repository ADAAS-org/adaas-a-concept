import { A_TYPES__NamespaceConstructor } from "@adaas/a-concept/global/A-Namespace/A_Namespace.types";
export type A_TYPES__ConfigContainerConstructor<T extends string> = {
    /**
     * The name of the Config Container
     */
    variables?: Array<T>;
    /**
     * Allows to set the default values for the variables
     */
    defaults?: Record<T, any>;
} & A_TYPES__NamespaceConstructor;
export type A_TYPES__ConfigContainer_DefaultProperties = 'CONFIG_SDK_VALIDATION' | 'CONFIG_VERBOSE' | 'CONFIG_IGNORE_ERRORS';
