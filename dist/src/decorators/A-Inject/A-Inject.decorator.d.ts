import { A_Component } from "../../global/A-Component/A-Component.class";
import { A_TYPES__A_InjectDecorator_EntityInjectionInstructions, A_TYPES__A_InjectDecoratorReturn } from "./A-Inject.decorator.types";
import { A_Fragment } from "../../global/A-Fragment/A-Fragment.class";
import { A_Scope } from "../../global/A-Scope/A-Scope.class";
import { A_Feature } from "../../global/A-Feature/A-Feature.class";
import { A_Entity } from "../../global/A-Entity/A-Entity.class";
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
export declare function A_Inject(feature: typeof A_Feature): A_TYPES__A_InjectDecoratorReturn;
export declare function A_Inject(component: {
    new (...args: any[]): A_Component;
}): A_TYPES__A_InjectDecoratorReturn;
export declare function A_Inject(fragment: {
    new (...args: any[]): A_Fragment;
}): A_TYPES__A_InjectDecoratorReturn;
export declare function A_Inject(entity: {
    new (...args: any[]): A_Entity;
}, config: Partial<A_TYPES__A_InjectDecorator_EntityInjectionInstructions>): A_TYPES__A_InjectDecoratorReturn;
