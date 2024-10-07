import { A_Namespace } from "../../global/A-Namespace/A_Namespace.class";
import { A_Component } from "../../global/A-Component/A-Component.class";
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
export declare function A_Inject<T extends {
    new (...args: any[]): A_Component;
}>(component: T): any;
export declare function A_Inject<T extends {
    new (...args: any[]): A_Namespace;
}>(namespace: T): any;
export declare function A_Inject<E extends {
    new (...args: any[]): A_Namespace;
}, T extends Array<E>>(namespaces: T): any;
