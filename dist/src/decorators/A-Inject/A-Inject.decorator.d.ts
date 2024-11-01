import { A_Component } from "../../global/A-Component/A-Component.class";
import { A_TYPES__A_InjectDecoratorReturn } from "./A-Inject.decorator.types";
import { A_Fragment } from "../../global/A-Fragment/A-Fragment.class";
import { A_Scope } from "../../global/A-Scope/A-Scope.class";
/**
 * A-Inject decorator
 *
 * This Decorator allows to inject dependencies into the module like
 * - Namespaces
 * - Other Concepts
 * - or maybe Components
 *
 * @param params
 * @returns
 */
export declare function A_Inject(scope: typeof A_Scope): A_TYPES__A_InjectDecoratorReturn;
export declare function A_Inject(component: typeof A_Component): A_TYPES__A_InjectDecoratorReturn;
export declare function A_Inject(component: {
    new (...args: any[]): any;
}): A_TYPES__A_InjectDecoratorReturn;
export declare function A_Inject(fragment: typeof A_Fragment): A_TYPES__A_InjectDecoratorReturn;
export declare function A_Inject<T extends Array<typeof A_Fragment>>(fragments: T): A_TYPES__A_InjectDecoratorReturn;
