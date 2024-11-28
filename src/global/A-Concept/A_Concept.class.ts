import { A_TYPES__ConceptStage, A_TYPES__ConceptAbstractionCallParams, A_TYPES__IConceptConstructor } from "./A_Concept.types";
import { A_Context } from "../A-Context/A-Context.class";
import { A_Container } from "../A-Container/A-Container.class";
// import { A_Logger } from "@adaas/a-concept/base/A-Logger/A-Logger.component";
import { A_Fragment } from "../A-Fragment/A-Fragment.class";
import { A_TYPES__ContainerMetaKey } from "../A-Container/A-Container.types";
import { A_Abstraction } from "@adaas/a-concept/decorators/A-Abstraction/A-Abstraction.decorator";
import { A_TYPES__A_StageStep } from "../A-Stage/A-Stage.types";
import { A_Channel } from "../A-Channel/A-Channel.class";
import { A_Feature } from "../A-Feature/A-Feature.class";
import { A_TYPES__FeatureConstructor } from "../A-Feature/A-Feature.types";
import { A_TYPES__Required } from "@adaas/a-utils";
import { A_TYPES__ScopeConstructor } from "../A-Scope/A-Scope.types";




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
    _Features extends A_Container<any>[] = any
> {

    // ==============================================================================
    // ====================  STATIC LIFECYCLE DECORATORS  ===========================
    // ==============================================================================
    /**
     * Load the concept. This step runs before any other steps to ensure that all components are loaded.
     */
    static Load() {
        return A_Abstraction(A_TYPES__ConceptStage.Load);
    }

    /**
     * Publish the concept to ADAAS platform. (Or any other place defined in the concept)
     *
     * [!] To extend the logic just create a custom containers and override the default behavior.
     */
    static Publish() {
        return A_Abstraction(A_TYPES__ConceptStage.Publish);
    }

    /**
     * Deploy the concept to the environment.
     */
    static Deploy() {
        return A_Abstraction(A_TYPES__ConceptStage.Deploy);
    }

    /**
     * Compiles the Concept in case there are some containers that require that. 
     * 
     * Can be used for static websites or any other concept that requires a build step.
     * 
     */
    static Build() {
        return A_Abstraction(A_TYPES__ConceptStage.Build);
    }

    /**
     *  Main execution of the concept.
     */
    static Run() {
        return A_Abstraction(A_TYPES__ConceptStage.Run);
    }

    /**
     *  Start the concept. Uses for servers or any other background services.
     */
    static Start() {
        return A_Abstraction(A_TYPES__ConceptStage.Start);
    }

    /**
     * Stop the concept. Uses for servers or any other background services.
     */
    static Stop() {
        return A_Abstraction(A_TYPES__ConceptStage.Stop);
    }



    // ==============================================================================
    // ==========================  MAIN Methods  ======================================
    // ==============================================================================

    protected containers: A_Container<any>[] = [];

    constructor(
        protected props: A_TYPES__IConceptConstructor<_Features>
    ) {

        A_Context.allocate(this, {
            name: props.name,
            fragments: props.fragments || [],
            entities: props.entities || [],
            // containers: props.containers
            components: [
                // A_Logger,
            ]
        });

        this.containers = props.containers || [];
    }


    get namespace() {
        return A_Context.scope(this).name;
    }

    get Scope() {
        return A_Context.scope(this);
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
        const definition = this.abstractionDefinition(A_TYPES__ConceptStage.Load, params);

        const abstraction = new A_Feature(definition);

        await abstraction.process();
    }



    /**
     * Run the concept.
     */
    async run(
        params?: Partial<A_TYPES__ConceptAbstractionCallParams>
    ) {
        await this.load(params);

        const definition = this.abstractionDefinition(A_TYPES__ConceptStage.Run, params);

        const abstraction = new A_Feature(definition);

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

        const definition = this.abstractionDefinition(A_TYPES__ConceptStage.Start, params);

        const abstraction = new A_Feature(definition);

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
        const definition = this.abstractionDefinition(A_TYPES__ConceptStage.Stop, params);

        const abstraction = new A_Feature(definition);

        await abstraction.process();
    }


    /**
     * Build the concept.
     */
    async build(
        params?: Partial<A_TYPES__ConceptAbstractionCallParams>
    ) {
        const definition = this.abstractionDefinition(A_TYPES__ConceptStage.Build, params);

        const abstraction = new A_Feature(definition);

        await abstraction.process();
    }


    /**
     * Deploy the concept.
     */
    async deploy(
        params?: Partial<A_TYPES__ConceptAbstractionCallParams>
    ) {
        const definition = this.abstractionDefinition(A_TYPES__ConceptStage.Deploy, params);

        const abstraction = new A_Feature(definition);

        await abstraction.process();

    }


    /**
     * Publish the concept.
     */
    async publish(
        params?: Partial<A_TYPES__ConceptAbstractionCallParams>
    ) {
        const definition = this.abstractionDefinition(A_TYPES__ConceptStage.Publish, params);

        const abstraction = new A_Feature(definition);

        await abstraction.process();
    }


    // =======================================================================
    // ==========================  CALL  =====================================
    // =======================================================================


    /**
     * Call the specific method of the concept or included modules.
     */
    async call<
        K extends Record<_Features[number]['name'], _Features[number]['exports'][number]>
    >(
        container: K[keyof K],
        params?: Partial<A_TYPES__ConceptAbstractionCallParams>
    ) {
        const definition = this.abstractionDefinition(A_TYPES__ConceptStage.Run, {
            components: params?.components,
            fragments: params?.fragments,
        });

        const feature = new A_Feature(definition);

        await feature.process();
    }


    abstractionDefinition(
        method: A_TYPES__ConceptStage,
        params?: Partial<A_TYPES__ConceptAbstractionCallParams>
    ): A_TYPES__Required<Partial<A_TYPES__FeatureConstructor>, ['steps', 'fragments', 'name', 'components']> {

        const abstractionSteps: Array<A_TYPES__A_StageStep> = [];

        this.containers.map(container => {
            const meta = A_Context.meta(container);

            const containerAbstractions: Array<A_TYPES__A_StageStep> = meta
                .abstractions(method)
                .map(step => ({
                    component: container,
                    ...step
                }));

            const containerScope = A_Context.scope(container);

            const componentsAbstractions = containerScope
                .components
                .map(component => A_Context.meta(component).abstractions(method).map(step => ({
                    component,
                    ...step
                })))
                .flat();

            abstractionSteps.push(
                ...containerAbstractions.map(step => ({
                    ...step,
                    component: container,
                })),

                ...componentsAbstractions
            );
        });


        return {
            ...params,
            name: `${this.namespace}.${method}`,
            steps: abstractionSteps,
            parent: this.Scope,
            components: params?.components || [],
            fragments: params?.fragments || [],
        };
    }


    private async execute(
        params: Partial<A_TYPES__ConceptAbstractionCallParams>
    ) {
        const fragments = params.fragments || [];
        const component = params.components || [];


        this.containers.map(container => {
            const meta = A_Context.meta(container);

            meta.get(A_TYPES__ContainerMetaKey.FEATURES)

        });


    }

}



