import { A_CommonHelper, A_TYPES__Required } from "@adaas/a-utils";
import { A_TYPES__ConfigContainerConstructor } from "./A-Config.types";
import { A_Fragment } from "@adaas/a-concept/global/A-Fragment/A-Fragment.class";


export class A_Config<
    T extends string = any
> extends A_Fragment {

    config: A_TYPES__ConfigContainerConstructor<T>;

    // Custom properties
    private VARIABLES: Map<string, any> = new Map<string, any>();

    CONFIG_PROPERTIES: T[] = [];

    protected DEFAULT_ALLOWED_TO_READ_PROPERTIES = [
        'CONFIG_SDK_VALIDATION',
        'CONFIG_VERBOSE',
        'CONFIG_IGNORE_ERRORS',
        'CONCEPT_ROOT_FOLDER',
    ] as const;


    constructor(
        config: A_TYPES__Required<Partial<A_TYPES__ConfigContainerConstructor<T>>, ['variables']>
    ) {
        super(config);

        this.config = A_CommonHelper.deepCloneAndMerge<A_TYPES__ConfigContainerConstructor<T>>(config as any, {
            name: this.name,
            strict: false,
            defaults: {} as Record<T, any>,
            variables: [] as T[]
        });

        this.CONFIG_PROPERTIES = this.config.variables ? this.config.variables : [];
    }

    protected async onInit(): Promise<void> {
        this.config.variables.forEach((variable) => {
            this.VARIABLES.set(variable, this.config.defaults[variable]);
        });
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
        if (this.CONFIG_PROPERTIES.includes(property as any)
            || this.DEFAULT_ALLOWED_TO_READ_PROPERTIES.includes(property as any)
            || !(this.config.strict)
        )
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