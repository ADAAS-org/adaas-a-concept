export type A_TYPES__ComponentMeta = {
    [A_TYPES__ComponentMetaKey.EXTENSIONS]: Map<string, A_TYPES__ComponentMeta_ExtensionItem>;
    [A_TYPES__ComponentMetaKey.FEATURES]: any[];
    [A_TYPES__ComponentMetaKey.INJECTIONS]: Map<Symbol | string, A_TYPES__ComponentMeta_InjectionParams>;
};
export declare enum A_TYPES__ComponentMetaKey {
    EXTENSIONS = "a-component-extensions",
    FEATURES = "a-component-features",
    INJECTIONS = "a-component-injections"
}
export type A_TYPES__ComponentMeta_ExtensionItem = {
    name: string;
    container: string;
    handler: string;
};
export type A_TYPES__ComponentMeta_InjectionParams = Array<{
    new (...args: any[]): any;
}>;
