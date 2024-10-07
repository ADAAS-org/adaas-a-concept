import { A_TYPES__A_CONCEPT_RootRunParams, A_TYPES__IConceptConstructor } from "./A_Concept.types";
import { A_Context } from "../A-Context/A-Context.class";
/**
 * A_Concept is a placeholder for the concept of the ani program.
 *
 * Concept - could be any Program regardless environment and it's goal.
 * It could be mobile, web or simple html page.
 * All depends on Containers and Components installed and provided in the Concept.
 *
 *
 * [!] Concept operates ONLY with all Components and Containers provided to achieve the goal.
 *
 *
 */
export declare class A_Concept {
    /**
     * Context is a root namespace for the concept.
     */
    Context: typeof A_Context;
    /**
     * Context provider is a singleton that provides the context for ALL concepts.
     */
    protected props: A_TYPES__IConceptConstructor;
    constructor(props: A_TYPES__IConceptConstructor);
    get namespace(): string;
    /**
     * Returns true if the class has inherited from the given class.
     *
     * @param cl
     * @returns
     */
    private hasInherited;
    protected init(): Promise<void>;
    /**
     * Run the concept.
     */
    run(params?: A_TYPES__A_CONCEPT_RootRunParams): Promise<void>;
    /**
     * Build the concept.
     */
    build(): Promise<void>;
    /**
     * Call the specific method of the concept or included modules.
     */
    call(): Promise<void>;
}
