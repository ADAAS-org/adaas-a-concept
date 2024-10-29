
export type A_TYPES__A_InjectDecoratorDescriptor = TypedPropertyDescriptor<(
    ...args: any[]
) => Promise<void>>


export type A_TYPES__A_InjectDecoratorReturn<T = any> = (
    target: T,
    propertyKey: string | symbol | undefined,
    parameterIndex: number
) => void


// export type A_TYPES__A_InjectDecoratorStorageInstruction = {
//     index: number,
//     type: typeof A_Namespace
//     | typeof A_Component
//     | typeof A_Container
//     | typeof A_ContextFragment
//     | Array<typeof A_Namespace>
//     | Array<typeof A_Component>
//     | Array<typeof A_Container>
//     | Array<typeof A_ContextFragment>
//     | { new(...args: any[]): any }
// }  

export type A_TYPES__A_InjectDecoratorStorageInstruction = Array<
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