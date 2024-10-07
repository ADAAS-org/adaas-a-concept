/**
 * Namespace Constructor Interface
 */
export type A_TYPES__NamespaceConstructor = {
    name?: string;
};
/**
 * Namespace Interface
 */
export interface A_TYPES__INamespace {
    name: string;
    ready: Promise<void>;
}
/**
 * Global Namespace Interface uses for extending the Namespace from other modules or SDKs
 *
 */
export interface A_TYPES__IGlobalNamespace extends A_TYPES__INamespace {
}
