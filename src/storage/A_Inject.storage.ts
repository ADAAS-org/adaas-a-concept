


// =================================================================================================
// ========== A-Inject Storage ====================================================================
// =================================================================================================

import { A_TYPES__A_InjectDecoratorStorageInstruction } from "../decorators/A-Inject/A-Inject.decorator.types";

export const A_STORAGE__A_Inject_MethodArgumentsKey = Symbol('a-inject-method-arguments');


/**
 * This storage is used to store the containers metadata, definitions and configurations
 * 
 */
export const A_STORAGE__A_Inject_Instructions: WeakMap<
    // Any Class
    { new(...args: any[]): any },

    // A set of instructions 
    Map<
        // Where key is method name
        Symbol | string,
        // And value is Injection instructions
        A_TYPES__A_InjectDecoratorStorageInstruction
    >
> = new WeakMap();


