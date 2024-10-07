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
export class A_Container<T extends A_Namespace = A_Namespace> {

    protected readonly namespace!: T;


    constructor(
        namespace?: T
    ) {
        if (namespace) {
            this.namespace = namespace;
        }
    }


    // bind(
    //     Context: T,
    //     /**
    //      * Context provider from parent Concept
    //      * It's possible to use the same ContextProvider for all Containers
    //      */
    //     ContextProvider: A_ContextProvider
    // ) {
    //     this.Context = Context;
    // }

}