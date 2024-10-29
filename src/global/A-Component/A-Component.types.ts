

export type A_TYPES__ComponentMeta = {
    [A_TYPES__ComponentMetaKey.EXTENSIONS]: Map<string, A_TYPES__ComponentMeta_ExtensionItem>,
    [A_TYPES__ComponentMetaKey.FEATURES]: any[],
    [A_TYPES__ComponentMetaKey.INJECTIONS]: Map<
        // Where key is method name
        Symbol | string,
        // And value is Injection instructions
        A_TYPES__ComponentMeta_InjectionParams
    >

}

export enum A_TYPES__ComponentMetaKey {
    EXTENSIONS = 'a-component-extensions',
    FEATURES = 'a-component-features',
    INJECTIONS = 'a-component-injections',
}


export type A_TYPES__ComponentMeta_ExtensionItem = {
    name: string,
    container: string,
    handler: string,
}


export type A_TYPES__ComponentMeta_InjectionParams = Array<
    // typeof A_Namespace
    // | typeof A_Component
    // | typeof A_Container
    // | typeof A_ContextFragment
    // | Array<typeof A_Namespace>
    // | Array<typeof A_Component>
    // | Array<typeof A_Container>
    // | Array<typeof A_ContextFragment>
    | { new(...args: any[]): any }
>

