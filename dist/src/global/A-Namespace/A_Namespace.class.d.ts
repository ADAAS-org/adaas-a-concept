import { A_TYPES__NamespaceConstructor, A_TYPES__INamespace } from './A_Namespace.types';
/**
 * A_Namespace is a base class for all Namespaces in the A
 *
 * Namespace is a shared object within some environment, service or Application.
 * It is used to share some data, configuration, dependencies, etc. between different parts of the application.
 *
 * Namespace allow to :
 * - share some data between different parts of the application,
 * - share some configuration between different parts of the application,
 * - share some dependencies between different parts of the application,
 * - extend the capabilities of the application by adding new features or modifying existing ones into base classes
 *
 */
export declare class A_Namespace<_ConstructorConfigType extends A_TYPES__NamespaceConstructor = any> implements A_TYPES__INamespace {
    protected config?: _ConstructorConfigType | undefined;
    /**
     * Namespace namespace
     */
    name: string;
    /**
     * Ready Promise to ensure the SDK is ready to use
     */
    ready: Promise<void>;
    constructor(config?: _ConstructorConfigType | undefined);
    private hasInherited;
    /**
     * Initializes the Namespace or can be used to reinitialize the Namespace
     */
    protected init(): Promise<void>;
    /**
     *  Before init hook to be used in inherited classes
     *
     * @returns
     */
    protected onBeforeInit(): Promise<void>;
    /**
     * Main initialization method for the SDK
     */
    protected onInit(): Promise<void>;
    /**
     *  After init hook to be used in inherited classes
     *
     * @returns
     */
    protected onAfterInit(): Promise<void>;
}
