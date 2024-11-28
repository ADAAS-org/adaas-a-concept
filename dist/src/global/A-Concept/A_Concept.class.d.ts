import { A_TYPES__ConceptStage, A_TYPES__ConceptAbstractionCallParams, A_TYPES__IConceptConstructor } from "./A_Concept.types";
import { A_Container } from "../A-Container/A-Container.class";
import { A_TYPES__FeatureConstructor } from "../A-Feature/A-Feature.types";
import { A_TYPES__Required } from "@adaas/a-utils";
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
export declare class A_Concept<_Features extends A_Container<any>[] = any> {
    protected props: A_TYPES__IConceptConstructor<_Features>;
    /**
     * Load the concept. This step runs before any other steps to ensure that all components are loaded.
     */
    static Load(): (target: A_Container<any> | import("../A-Component/A-Component.class").A_Component, propertyKey: string, descriptor: import("../../..").A_TYPES__A_AbstractionDecoratorDescriptor) => void;
    /**
     * Publish the concept to ADAAS platform. (Or any other place defined in the concept)
     *
     * [!] To extend the logic just create a custom containers and override the default behavior.
     */
    static Publish(): (target: A_Container<any> | import("../A-Component/A-Component.class").A_Component, propertyKey: string, descriptor: import("../../..").A_TYPES__A_AbstractionDecoratorDescriptor) => void;
    /**
     * Deploy the concept to the environment.
     */
    static Deploy(): (target: A_Container<any> | import("../A-Component/A-Component.class").A_Component, propertyKey: string, descriptor: import("../../..").A_TYPES__A_AbstractionDecoratorDescriptor) => void;
    /**
     * Compiles the Concept in case there are some containers that require that.
     *
     * Can be used for static websites or any other concept that requires a build step.
     *
     */
    static Build(): (target: A_Container<any> | import("../A-Component/A-Component.class").A_Component, propertyKey: string, descriptor: import("../../..").A_TYPES__A_AbstractionDecoratorDescriptor) => void;
    /**
     *  Main execution of the concept.
     */
    static Run(): (target: A_Container<any> | import("../A-Component/A-Component.class").A_Component, propertyKey: string, descriptor: import("../../..").A_TYPES__A_AbstractionDecoratorDescriptor) => void;
    /**
     *  Start the concept. Uses for servers or any other background services.
     */
    static Start(): (target: A_Container<any> | import("../A-Component/A-Component.class").A_Component, propertyKey: string, descriptor: import("../../..").A_TYPES__A_AbstractionDecoratorDescriptor) => void;
    /**
     * Stop the concept. Uses for servers or any other background services.
     */
    static Stop(): (target: A_Container<any> | import("../A-Component/A-Component.class").A_Component, propertyKey: string, descriptor: import("../../..").A_TYPES__A_AbstractionDecoratorDescriptor) => void;
    protected containers: A_Container<any>[];
    constructor(props: A_TYPES__IConceptConstructor<_Features>);
    get namespace(): string;
    get Scope(): import("../A-Scope/A-Scope.class").A_Scope;
    /**
     * Load the concept.
     */
    load(params?: Partial<A_TYPES__ConceptAbstractionCallParams>): Promise<void>;
    /**
     * Run the concept.
     */
    run(params?: Partial<A_TYPES__ConceptAbstractionCallParams>): Promise<void>;
    /**
     * Start the concept.
     *
     * @param params
     */
    start(params?: Partial<A_TYPES__ConceptAbstractionCallParams>): Promise<void>;
    /**
     * Stop the concept.
     *
     * @param params
     */
    stop(params?: Partial<A_TYPES__ConceptAbstractionCallParams>): Promise<void>;
    /**
     * Build the concept.
     */
    build(params?: Partial<A_TYPES__ConceptAbstractionCallParams>): Promise<void>;
    /**
     * Deploy the concept.
     */
    deploy(params?: Partial<A_TYPES__ConceptAbstractionCallParams>): Promise<void>;
    /**
     * Publish the concept.
     */
    publish(params?: Partial<A_TYPES__ConceptAbstractionCallParams>): Promise<void>;
    /**
     * Call the specific method of the concept or included modules.
     */
    call<K extends Record<_Features[number]['name'], _Features[number]['exports'][number]>>(container: K[keyof K], params?: Partial<A_TYPES__ConceptAbstractionCallParams>): Promise<void>;
    abstractionDefinition(method: A_TYPES__ConceptStage, params?: Partial<A_TYPES__ConceptAbstractionCallParams>): A_TYPES__Required<Partial<A_TYPES__FeatureConstructor>, ['steps', 'fragments', 'name', 'components']>;
    private execute;
}
