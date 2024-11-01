import { A_TYPES__Required } from "@adaas/a-utils";
import { A_TYPES__ConfigContainerConstructor } from "./A-Config.types";
import { A_Fragment } from "../../global/A-Fragment/A-Fragment.class";
export declare class A_Config<T extends string = any> extends A_Fragment {
    config: A_TYPES__ConfigContainerConstructor<T>;
    private VARIABLES;
    CONFIG_PROPERTIES: T[];
    protected DEFAULT_ALLOWED_TO_READ_PROPERTIES: readonly ["CONFIG_SDK_VALIDATION", "CONFIG_VERBOSE", "CONFIG_IGNORE_ERRORS"];
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
    set<V extends string = T | typeof this.DEFAULT_ALLOWED_TO_READ_PROPERTIES[number]>(variables: Array<{
        property: V;
        value: any;
    }>): any;
    set<V extends string = T | typeof this.DEFAULT_ALLOWED_TO_READ_PROPERTIES[number]>(variables: Record<V, any>): any;
    set<V extends string = T | typeof this.DEFAULT_ALLOWED_TO_READ_PROPERTIES[number]>(property: V, value: any): any;
}
