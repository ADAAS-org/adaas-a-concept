import { A_Namespace } from "../A-Namespace/A_Namespace.class";
/**
 * This class should combine Components to achieve the goal withing Context
 * Container could be interpreted as any Structure Entity, or Abstract Entity
 * For example:
 * - Controller (all Controllers with base logic)
 * - Service (all Services with base logic)
 * - Module (all Modules with base logic)
 * - etc.
 */
export declare class A_Container<T extends A_Namespace = A_Namespace> {
    protected readonly namespace: T;
    constructor(namespace?: T);
}
