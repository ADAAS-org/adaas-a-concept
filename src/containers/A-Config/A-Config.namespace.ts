import { A_Namespace } from "@adaas/a-concept/global/A-Namespace/A_Namespace.class";
import { A_TYPES__ConfigContainerConstructor } from "./A-Config.types";


export class A_Config<
    T extends string = any
> extends A_Namespace<A_TYPES__ConfigContainerConstructor<T>> {

    // Custom properties
    private VARIABLES: Map<string, any> = new Map<string, any>();
    CONFIG_PROPERTIES: T[] = [];

    protected DEFAULT_ALLOWED_TO_READ_PROPERTIES = [
        'CONFIG_SDK_VALIDATION',
        'CONFIG_VERBOSE',
        'CONFIG_IGNORE_ERRORS',
    ] as const;


    constructor(
        config: A_TYPES__ConfigContainerConstructor<T>
    ) {
        super(config);

        const targetConfig = config

        this.CONFIG_PROPERTIES = targetConfig.variables ? targetConfig.variables : [];
    }


    /** 
     * This method is used to get the configuration property by name
     * 
     * @param property 
     * @returns 
     */
    get<_OutType = any>(
        property: T | typeof this.DEFAULT_ALLOWED_TO_READ_PROPERTIES[number]
    ): _OutType {
        if (this.CONFIG_PROPERTIES.includes(property as any))
            return this.VARIABLES.get(property as string) as _OutType;

        throw new Error('Property not exists or not allowed to read') as never;
        // return this.concept.Errors.throw(A_SDK_CONSTANTS__ERROR_CODES.CONFIGURATION_PROPERTY_NOT_EXISTS_OR_NOT_ALLOWED_TO_READ) as never;
    }



    /**
     * 
     * This method is used to set the configuration property by name
     * OR set multiple properties at once by passing an array of objects
     * 
     * @param variables 
     */
    set<V extends string = T | typeof this.DEFAULT_ALLOWED_TO_READ_PROPERTIES[number]>(
        variables: Array<{
            property: V,
            value: any
        }>
    )
    set<V extends string = T | typeof this.DEFAULT_ALLOWED_TO_READ_PROPERTIES[number]>(
        variables: Record<V, any>
    )
    set<V extends string = T | typeof this.DEFAULT_ALLOWED_TO_READ_PROPERTIES[number]>(
        property: V,
        value: any
    )
    set<V extends string = T | typeof this.DEFAULT_ALLOWED_TO_READ_PROPERTIES[number]>(
        property: V | Array<{
            property: V,
            value: any
        }> | Record<V, any>,
        value?: any
    ) {
        const array = Array.isArray(property)
            ? property
            : typeof property === 'string'
                ? [{ property, value }]
                : Object
                    .keys(property)
                    .map((key) => ({
                        property: key,
                        value: property[key]
                    }));

        for (const { property, value } of array) {

            let targetValue = value
                ? value
                : this.config?.defaults
                    ? this.config.defaults[property as T]
                    : undefined;

            this.VARIABLES.set(property as string, targetValue);
        }
    }
}