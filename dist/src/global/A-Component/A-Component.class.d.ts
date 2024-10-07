import { A_Namespace } from "../A-Namespace/A_Namespace.class";
/**
 * This element only contains the specific code
 *
 */
export declare class A_Component<T extends A_Namespace = A_Namespace> {
    /**
     * Primary context that impacts the component behavior
     */
    protected namespace: A_Namespace;
    constructor(
    /**
     * Primary context that impacts the component behavior
     */
    namespace: A_Namespace);
}
