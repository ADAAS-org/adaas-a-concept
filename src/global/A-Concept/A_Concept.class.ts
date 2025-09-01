import { A_TYPES__ConceptStage, A_TYPES__ConceptAbstractionCallParams, A_TYPES__IConceptConstructor, A_TYPES__ConceptAbstractionMeta } from "./A_Concept.types";
import { A_Container } from "../A-Container/A-Container.class";
import { A_Abstraction } from "../A-Abstraction/A-Abstraction.class";
import { A_ConceptMeta } from "./A_Concept.meta";
import { A_Abstraction_Extend } from "@adaas/a-concept/decorators/A-Abstraction/A-Abstraction-Extend.decorator";


// export type RunParams<T> = T extends A_Container<any, infer Params> ? Params : never;



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
export class A_Concept<
    _Imports extends A_Container[] = any
> {

    // ==============================================================================
    // ====================  STATIC LIFECYCLE DECORATORS  ===========================
    // ==============================================================================
    /**
     * Load the concept. This step runs before any other steps to ensure that all components are loaded.
     */
    static Load(): ReturnType<typeof A_Abstraction_Extend> {
        return A_Abstraction.Extend(A_TYPES__ConceptStage.Load);
    }

    /**
     * Publish the concept to ADAAS platform. (Or any other place defined in the concept)
     *
     * [!] To extend the logic just create a custom containers and override the default behavior.
     */
    static Publish(): ReturnType<typeof A_Abstraction_Extend> {
        return A_Abstraction.Extend(A_TYPES__ConceptStage.Publish);
    }

    /**
     * Deploy the concept to the environment.
     */
    static Deploy() {
        return A_Abstraction.Extend(A_TYPES__ConceptStage.Deploy);
    }

    /**
     * Compiles the Concept in case there are some containers that require that. 
     * 
     * Can be used for static websites or any other concept that requires a build step.
     * 
     */
    static Build() {
        return A_Abstraction.Extend(A_TYPES__ConceptStage.Build);
    }

    /**
     *  Main execution of the concept.
     */
    static Run() {
        return A_Abstraction.Extend(A_TYPES__ConceptStage.Run);
    }

    /**
     *  Start the concept. Uses for servers or any other background services.
     */
    static Start() {
        return A_Abstraction.Extend(A_TYPES__ConceptStage.Start);
    }

    /**
     * Stop the concept. Uses for servers or any other background services.
     */
    static Stop() {
        return A_Abstraction.Extend(A_TYPES__ConceptStage.Stop);
    }


    private sharedBase!: A_Container;
    private meta!: A_ConceptMeta



    // ==============================================================================
    // ==========================  MAIN Methods  ======================================
    // ==============================================================================

    protected containers!: A_Container[];

    constructor(
        protected props: A_TYPES__IConceptConstructor<_Imports>
    ) {
        this.sharedBase = new A_Container({
            name: props.name,
            fragments: props.fragments || [],
            entities: props.entities || [],
            // containers: props.containers
            components: [
                // A_Logger,
            ]
        });

        this.containers = (props.containers || []).map(container => {
            container.Scope.parent(this.Scope);

            return container;
        });

        this.meta = new A_ConceptMeta(this.containers, this.sharedBase);
    }


    get namespace() {
        return this.sharedBase.name;
    }

    get Scope() {
        return this.sharedBase.Scope;
    }



    // =======================================================================
    // ==========================  LIFECYCLE  ================================
    // =======================================================================


    /**
     * Load the concept.
     */
    async load(
        params?: Partial<A_TYPES__ConceptAbstractionCallParams>
    ) {
        const abstraction = this.meta.abstraction(A_TYPES__ConceptStage.Load, params);

        await abstraction.process();
    }



    /**
     * Run the concept.
     */
    async run(
        params?: Partial<A_TYPES__ConceptAbstractionCallParams>
    ) {
        await this.load(params);

        const abstraction = this.meta.abstraction(A_TYPES__ConceptStage.Run, params);

        await abstraction.process();
    }


    /**
     * Start the concept.
     * 
     * @param params 
     */
    async start(
        params?: Partial<A_TYPES__ConceptAbstractionCallParams>
    ) {
        await this.load(params);

        const abstraction = this.meta.abstraction(A_TYPES__ConceptStage.Start, params);

        await abstraction.process();
    }


    /**
     * Stop the concept.
     * 
     * @param params 
     */
    async stop(
        params?: Partial<A_TYPES__ConceptAbstractionCallParams>
    ) {
        const abstraction = this.meta.abstraction(A_TYPES__ConceptStage.Stop, params);

        await abstraction.process();
    }


    /**
     * Build the concept.
     */
    async build(
        params?: Partial<A_TYPES__ConceptAbstractionCallParams>
    ) {
        const abstraction = this.meta.abstraction(A_TYPES__ConceptStage.Build, params);

        await abstraction.process();
    }


    /**
     * Deploy the concept.
     */
    async deploy(
        params?: Partial<A_TYPES__ConceptAbstractionCallParams>
    ) {
        const abstraction = this.meta.abstraction(A_TYPES__ConceptStage.Deploy, params);

        await abstraction.process();

    }


    /**
     * Publish the concept.
     */
    async publish(
        params?: Partial<A_TYPES__ConceptAbstractionCallParams>
    ) {
        const abstraction = this.meta.abstraction(A_TYPES__ConceptStage.Publish, params);

        await abstraction.process();
    }


    // =======================================================================
    // ==========================  CALL  =====================================
    // =======================================================================


    /**
     * Call the specific method of the concept or included modules.
     */
    async call<
        K extends Record<_Imports[number]['name'], string>
    >(
        container: K[keyof K],
        params?: Partial<A_TYPES__ConceptAbstractionCallParams>
    ) {
        // const definition = this.meta.abstractionDefinition(A_TYPES__ConceptStage.Run, {
        //     components: params?.components,
        //     fragments: params?.fragments,
        // });

        // const feature = new A_Feature(definition);

        // await feature.process();
    }

}



