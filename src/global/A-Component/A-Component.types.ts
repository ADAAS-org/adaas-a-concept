import { A_Feature } from "../A-Feature/A-Feature.class"
import { A_Fragment } from "../A-Fragment/A-Fragment.class"
import { A_Meta } from "../A-Meta/A-Meta.class"
import { A_Scope } from "../A-Scope/A-Scope.class"
import { A_Component } from "./A-Component.class"


export type A_TYPES__ComponentCallParams<T extends string> = {
    name: T,
    fragments: Array<A_Fragment>,
    components: Array<{ new(...args: any[]): any }>
}


export type A_TYPES__ComponentMeta = {
    [A_TYPES__ComponentMetaKey.EXTENSIONS]: A_Meta<{

        /**
         * Where Key the regexp for what to apply the extension
         * A set of container names or a wildcard, or a regexp
         * 
         *
         * Where value is the extension instructions
         */
        [Key: string]: A_TYPES__ComponentMeta_ExtensionItem[]
    }>,


    [A_TYPES__ComponentMetaKey.FEATURES]: any[],


    [A_TYPES__ComponentMetaKey.INJECTIONS]: A_Meta<{
        /**
         * Where Key is the name of the injection
         * 
         * Where value is the list of injections
         */
        [Key: string]: Array<A_TYPES__ComponentMeta_InjectionParam>
    }>
}

export enum A_TYPES__ComponentMetaKey {
    EXTENSIONS = 'a-component-extensions',
    FEATURES = 'a-component-features',
    INJECTIONS = 'a-component-injections',
}

export type A_TYPES__ComponentMetaExtension = {
    handler: string,
    args: A_TYPES__ComponentMeta_InjectionParam[]
}


export type A_TYPES__ComponentMeta_ExtensionItem = {
    name: string,
    handler: string,
}



export type A_TYPES__ComponentMeta_InjectionParam =
    { new(...args: any[]): A_Fragment }
    | { new(...args: any[]): A_Component }
    // | { new(...args: any[]): any }
    | { new(...args: any[]): A_Scope }
    | { new(...args: any[]): A_Feature };
// typeof A_Fragment
// | typeof A_Component
// // | { new(...args: any[]): any }
// | typeof A_Scope
// | typeof A_Feature;

