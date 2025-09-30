import { A_TYPES__ConceptStage, A_TYPES__IConceptConstructor } from "./A_Concept.types";
import { A_Container } from "../A-Container/A-Container.class";
import { A_Abstraction } from "../A-Abstraction/A-Abstraction.class";
import { A_ConceptMeta } from "./A_Concept.meta";
import { A_Abstraction_Extend } from "@adaas/a-concept/decorators/A-Abstraction/A-Abstraction-Extend.decorator";
import { A_Scope } from "../A-Scope/A-Scope.class";
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
export class A_Concept<
    _Imports extends A_Container[] = A_Container[]
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


    private meta!: A_ConceptMeta
    private _name!: string;



    // ==============================================================================
    // ==========================  MAIN Methods  ======================================
    // ==============================================================================

    protected containers!: A_Container[];

    constructor(
        protected props: A_TYPES__IConceptConstructor<_Imports>
    ) {
        this._name = props.name || A_Context.root.name;

        if (props.components && props.components.length)
            props.components.forEach(component => this.Scope.register(component))

        if (props.fragments && props.fragments.length)
            props.fragments.forEach(fragment => this.Scope.register(fragment))

        if (props.entities && props.entities.length)
            props.entities.forEach(entity => this.Scope.register(entity))

        this.containers = props.containers || [];
    }


    get namespace() {
        return A_Context.root.name;
    }

    get Scope() {
        return A_Context.root;
    }

    /**
     * Register a class or value in the concept scope.
     */
    get register(): A_Scope['register'] {
        return this.Scope.register.bind(this.Scope);
    }

    /**
     * Resolve a class or value from the concept scope.
     */
    get resolve(): A_Scope['resolve'] {
        return this.Scope.resolve.bind(this.Scope);
    }


    // =======================================================================
    // ==========================  LIFECYCLE  ================================
    // =======================================================================


    /**
     * Load the concept.
     */
    async load(
        scope?: A_Scope,
    ) {
        scope = scope ? scope.inherit(this.Scope) : this.Scope;

        const abstraction = this.abstraction(A_TYPES__ConceptStage.Load, scope);

        await abstraction.process();
    }



    /**
     * Run the concept.
     */
    async run(
        scope?: A_Scope,
    ) {
        scope = scope ? scope.inherit(this.Scope) : this.Scope;

        const abstraction = this.abstraction(A_TYPES__ConceptStage.Run, scope);

        await abstraction.process();
    }


    /**
     * Start the concept.
     * 
     * @param params 
     */
    async start(
        scope?: A_Scope,
    ) {
        scope = scope ? scope.inherit(this.Scope) : this.Scope;

        const abstraction = this.abstraction(A_TYPES__ConceptStage.Start, scope);

        await abstraction.process();
    }


    /**
     * Stop the concept.
     * 
     * @param params 
     */
    async stop(
        scope?: A_Scope,
    ) {
        scope = scope ? scope.inherit(this.Scope) : this.Scope;

        const abstraction = this.abstraction(A_TYPES__ConceptStage.Stop, scope);

        await abstraction.process();
    }


    /**
     * Build the concept.
     */
    async build(
        scope?: A_Scope,
    ) {
        scope = scope ? scope.inherit(this.Scope) : this.Scope;

        const abstraction = this.abstraction(A_TYPES__ConceptStage.Build, scope);

        await abstraction.process();
    }


    /**
     * Deploy the concept.
     */
    async deploy(
        scope?: A_Scope,
    ) {
        scope = scope ? scope.inherit(this.Scope) : this.Scope;

        const abstraction = this.abstraction(A_TYPES__ConceptStage.Deploy, scope);

        await abstraction.process();

    }


    /**
     * Publish the concept.
     */
    async publish(
        scope?: A_Scope,
    ) {
        scope = scope ? scope.inherit(this.Scope) : this.Scope;

        const abstraction = this.abstraction(A_TYPES__ConceptStage.Publish, scope);

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
    ) {
        // const definition = this.meta.abstractionDefinition(A_TYPES__ConceptStage.Run, {
        //     components: params?.components,
        //     fragments: params?.fragments,
        // });

        // const feature = new A_Feature(definition);

        // await feature.process();
    }



    protected abstraction(
        method: A_TYPES__ConceptStage,
        scope: A_Scope
    ): A_Abstraction {

        const featureDefinitions = this.containers.map(container => {
            const definition = A_Context.abstractionDefinition(container, method, container.Scope);

            return {
                ...definition,
                steps: definition.steps.map(step => ({ ...step, component: step.component ? step.component : container }))
            }
        });

        const definition = {
            name: `${this.namespace}.${method}`,
            features: featureDefinitions,
            scope
        };

        return new A_Abstraction(definition);
    }
}



