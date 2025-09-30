import { A_TYPES__Required } from "@adaas/a-utils";
import { A_TYPES__ConfigContainerConstructor } from "./A-Config.types";
import { A_Fragment } from "../../global/A-Fragment/A-Fragment.class";
import { A_CONSTANTS__DEFAULT_ENV_VARIABLES_ARRAY, A_TYPES__ConceptENVVariables } from "../../constants/env.constants";
export declare class A_Config<T extends string = A_TYPES__ConceptENVVariables> extends A_Fragment {
    config: A_TYPES__ConfigContainerConstructor<T>;
    private VARIABLES;
    CONFIG_PROPERTIES: T[];
    protected DEFAULT_ALLOWED_TO_READ_PROPERTIES: readonly ["A_CONCEPT_NAMESPACE", "A_CONCEPT_ENVIRONMENT", "A_CONCEPT_ROOT_FOLDER", "CONFIG_VERBOSE", "CONFIG_IGNORE_ERRORS"];
    constructor(config: A_TYPES__Required<Partial<A_TYPES__ConfigContainerConstructor<T>>, ['variables']>);
    protected onInit(): Promise<void>;
    /**
     * This method is used to get the configuration property by name
     *
     * @param property
     * @returns
     */
    get<_OutType = any>(property: T | typeof this.DEFAULT_ALLOWED_TO_READ_PROPERTIES[number]): _OutType;
    /**
     *
     * This method is used to set the configuration property by name
     * OR set multiple properties at once by passing an array of objects
     *
     * @param variables
     */
    set(variables: Array<{
        property: T | typeof A_CONSTANTS__DEFAULT_ENV_VARIABLES_ARRAY[number];
        value: any;
    }>): any;
    set(variables: Partial<Record<T | typeof A_CONSTANTS__DEFAULT_ENV_VARIABLES_ARRAY[number], any>>): any;
    set(property: T | typeof A_CONSTANTS__DEFAULT_ENV_VARIABLES_ARRAY[number], value: any): any;
}
