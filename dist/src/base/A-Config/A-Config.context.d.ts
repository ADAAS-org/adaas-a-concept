import { A_TYPES__ConfigContainerConstructor } from "./A-Config.types";
import { A_Fragment } from "../../global/A-Fragment/A-Fragment.class";
import { A_TYPES__ConceptENVVariables } from "../../constants/env.constants";
export declare class A_Config<T extends Array<string | A_TYPES__ConceptENVVariables[number]> = any[]> extends A_Fragment {
    config: A_TYPES__ConfigContainerConstructor<T>;
    private VARIABLES;
    CONFIG_PROPERTIES: T;
    protected DEFAULT_ALLOWED_TO_READ_PROPERTIES: readonly ["A_CONCEPT_NAMESPACE", "A_CONCEPT_ENVIRONMENT", "A_CONCEPT_ROOT_FOLDER", "CONFIG_VERBOSE", "CONFIG_IGNORE_ERRORS"];
    constructor(config: Partial<A_TYPES__ConfigContainerConstructor<T>>);
    /**
     * This method is used to get the configuration property by name
     *
     * @param property
     * @returns
     */
    get<_OutType = any>(property: T[number] | typeof this.DEFAULT_ALLOWED_TO_READ_PROPERTIES[number]): _OutType;
    /**
     *
     * This method is used to set the configuration property by name
     * OR set multiple properties at once by passing an array of objects
     *
     * @param variables
     */
    set(variables: Array<{
        property: T[number] | A_TYPES__ConceptENVVariables[number];
        value: any;
    }>): any;
    set(variables: Partial<Record<T[number] | A_TYPES__ConceptENVVariables[number], any>>): any;
    set(property: T[number] | A_TYPES__ConceptENVVariables[number], value: any): any;
}
