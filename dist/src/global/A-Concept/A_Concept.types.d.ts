import { A_Concept } from "./A_Concept.class";
import { A_Namespace } from "../A-Namespace/A_Namespace.class";
import { A_Container } from "../A-Container/A-Container.class";
export interface A_TYPES__IConceptConstructor {
    name: string;
    description?: string;
    /**
     * A set of Namespaces that the concept depends on.
     * These namespaces will create a new Context for the concept.
     *
     */
    context?: Array<A_Namespace>;
    /**
     * A set of Containers that the concept depends on.
     * These containers will create a new Container for the concept.
     */
    containers?: Array<{
        new (...args: any[]): A_Container;
    }>;
    /**
     * A set of external Concepts that can be used in the current Concept.
     * To provide additional functionality or extend the current Concept.
     */
    import?: Array<A_Concept>;
}
export type A_TYPES__A_CONCEPT_RootRunParams = {};
