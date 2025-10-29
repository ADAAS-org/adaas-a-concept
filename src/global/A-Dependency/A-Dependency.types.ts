

/**
 * A-Dependency require decorator return type 
 */
export type A_TYPES__A_Dependency_RequireDecoratorReturn<T = any> = (
    target: T,
    propertyKey: string | symbol | undefined,
    parameterIndex: number
) => void

/**
 * A-Dependency load decorator return type 
 */
export type A_TYPES__A_Dependency_LoadDecoratorReturn<T = any> = (
    target: T,
    propertyKey: string | symbol | undefined,
    parameterIndex: number
) => void

/**
 * A-Dependency default decorator return type
 */
export type A_TYPES__A_Dependency_DefaultDecoratorReturn<T = any> = (
    target: T,
    propertyKey: string | symbol | undefined,
    parameterIndex: number
) => void