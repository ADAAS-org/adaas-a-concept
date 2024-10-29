import { A_TYPES__A_InjectDecoratorStorageInstruction } from "../decorators/A-Inject/A-Inject.decorator.types";
export declare const A_STORAGE__A_Inject_MethodArgumentsKey: unique symbol;
/**
 * This storage is used to store the containers metadata, definitions and configurations
 *
 */
export declare const A_STORAGE__A_Inject_Instructions: WeakMap<{
    new (...args: any[]): any;
}, Map<Symbol | string, A_TYPES__A_InjectDecoratorStorageInstruction>>;
