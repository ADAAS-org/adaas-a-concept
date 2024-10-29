import { A_TYPES__ConceptStage, A_TYPES__ConceptStageParams, A_TYPES__IConceptConstructor } from "./A_Concept.types";
import { A_Context } from "../A-Context/A-Context.class";
import { A_Container } from "../A-Container/A-Container.class";
import { A_Logger } from "@adaas/a-concept/base/A-Logger/A-Logger.component";
import { A_Fragment } from "../A-Fragment/A-Fragment.class";
import { A_TYPES__ContainerMetaKey } from "../A-Container/A-Container.types";
import { A_Stage } from "@adaas/a-concept/decorators/A-Stage/A-Stage.decorator";




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
    static get Load() {
        return A_Stage(A_TYPES__ConceptStage.Load);
    }

    /**
     * Publish the concept to ADAAS platform. (Or any other place defined in the concept)
     *
     * [!] To extend the logic just create a custom containers and override the default behavior.
     */
    static get Publish() {
        return A_Stage(A_TYPES__ConceptStage.Publish);
    }

    /**
     * Deploy the concept to the environment.
     */
    static get Deploy() {
        return A_Stage(A_TYPES__ConceptStage.Deploy);
    }

    /**
     * Compiles the Concept in case there are some containers that require that. 
     * 
     * Can be used for static websites or any other concept that requires a build step.
     * 
     */
    static get Build() {
        return A_Stage(A_TYPES__ConceptStage.Build);
    }

    /**
     *  Main execution of the concept.
     */
    static get Run() {
        return A_Stage(A_TYPES__ConceptStage.Run);
    }

    /**
     *  Start the concept. Uses for servers or any other background services.
     */
    static get Start() {
        return A_Stage(A_TYPES__ConceptStage.Start);
    }

    /**
     * Stop the concept. Uses for servers or any other background services.
     */
    static get Stop() {
        return A_Stage(A_TYPES__ConceptStage.Stop);
    }



    // ==============================================================================
    // ==========================  MAIN Class  ======================================
    // ==============================================================================

    protected containers: A_Container<any>[] = [];

    constructor(
        protected props: A_TYPES__IConceptConstructor<_Features>
    ) {
        A_Context.allocate(this, {
            name: props.name,
            fragments: props.fragments || [],
            // containers: props.containers
            components: [
                A_Logger,
            ]
        });

        this.containers = props.containers || [];
    }


    get namespace() {
        return A_Context.scope(this).name;
    }


    // =======================================================================
    // ==========================  LIFECYCLE  ================================
    // =======================================================================

    /**
     * Run the concept.
     */
    async run(
        params?: Partial<A_TYPES__ConceptStageParams>
    ) {

    }


    /**
     * Build the concept.
     */
    async build(
        params?: Partial<A_TYPES__ConceptStageParams>
    ) {

    }


    // /**
    //  * Deploy the concept.
    //  */
    async deploy(
        params?: Partial<A_TYPES__ConceptStageParams>
    ) {

    }


    // /**
    //  * Publish the concept.
    //  */
    async publish(
        params?: Partial<A_TYPES__ConceptStageParams>
    ) {

    }


    /**
     * Call the specific method of the concept or included modules.
     */
    async call<
        K extends Record<_Features[number]['name'], _Features[number]['exports'][number]>
    >(
        container: K[keyof K],
        params?: A_Fragment[]
    ) {
        // for (const feature of this.features) {
        //     if (methodName in feature) {
        //         (feature as any)[methodName](...args);
        //     }

        // }
    }


    private async runStage(
        method: A_TYPES__ConceptStage,
        params: Partial<A_TYPES__ConceptStageParams>
    ) {

        const stages: any[] = [];

        this.containers.map(container => {
            const meta = A_Context.meta(container);

            const containerStages = meta.get(A_TYPES__ContainerMetaKey.STAGES)


            if (containerStages) {
                for (const [name, stage] of containerStages) {
                    if (stage.name === method) {
                        stages.push({
                            name,
                            container,
                        });
                    }
                }

            }
        });

        const scope = A_Context.allocate(this, {
            components: params.components,
            fragments: params.fragments,
            parent: A_Context.scope(this)
        });

        for (const stage of stages) {
            await stage.container[stage.name](params);
        }

    }


    private async execute(
        params: Partial<A_TYPES__ConceptStageParams>
    ) {
        const fragments = params.fragments || [];
        const component = params.components || [];


        this.containers.map(container => {
            const meta = A_Context.meta(container);

            meta.get(A_TYPES__ContainerMetaKey.FEATURES)

        });


    }

}

