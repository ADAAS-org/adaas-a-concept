import { A_Container } from "../A-Container/A-Container.class";
import { A_Abstraction } from "../A-Abstraction/A-Abstraction.class";
import { A_Abstraction_Extend } from "@adaas/a-concept/global/A-Abstraction/A-Abstraction-Extend.decorator";
import { A_Scope } from "../A-Scope/A-Scope.class";
import { A_Context } from "../A-Context/A-Context.class";
import { A_TYPES__ConceptAbstractions } from "./A-Concept.constants";
import { A_TYPES__Concept_Init } from "./A-Concept.types";
import { A_TYPES__AbstractionDecoratorConfig } from "../A-Abstraction/A-Abstraction.types";
import { A_Feature } from "../A-Feature/A-Feature.class";



export class A_Concept<
    _Imports extends A_Container[] = A_Container[]
> {

    // ==============================================================================
    // ====================  STATIC LIFECYCLE DECORATORS  ===========================
    // ==============================================================================
    /**
     * Load the concept. This step runs before any other steps to ensure that all components are loaded.
     */
    static Load(
        /**
         * provide additional configuration for the abstraction extension to make it dependent on other factors
         */
        config?: Partial<A_TYPES__AbstractionDecoratorConfig>
    ): ReturnType<typeof A_Abstraction_Extend> {
        return A_Abstraction.Extend(A_TYPES__ConceptAbstractions.Load, config);
    }

    /**
     * Publish the concept to ADAAS platform. (Or any other place defined in the concept)
     *
     * [!] To extend the logic just create a custom containers and override the default behavior.
     */
    static Publish(
        /**
        * provide additional configuration for the abstraction extension to make it dependent on other factors
        */
        config?: Partial<A_TYPES__AbstractionDecoratorConfig>
    ): ReturnType<typeof A_Abstraction_Extend> {
        return A_Abstraction.Extend(A_TYPES__ConceptAbstractions.Publish);
    }

    /**
     * Deploy the concept to the environment.
     */
    static Deploy(
        /**
        * provide additional configuration for the abstraction extension to make it dependent on other factors
        */
        config?: Partial<A_TYPES__AbstractionDecoratorConfig>
    ) {
        return A_Abstraction.Extend(A_TYPES__ConceptAbstractions.Deploy, config);
    }

    /**
     * Compiles the Concept in case there are some containers that require that. 
     * 
     * Can be used for static websites or any other concept that requires a build step.
     * 
     */
    static Build(
        /**
        * provide additional configuration for the abstraction extension to make it dependent on other factors
        */
        config?: Partial<A_TYPES__AbstractionDecoratorConfig>
    ) {
        return A_Abstraction.Extend(A_TYPES__ConceptAbstractions.Build, config);
    }

    /**
     *  Main execution of the concept.
     */
    static Run(
        /**
        * provide additional configuration for the abstraction extension to make it dependent on other factors
        */
        config?: Partial<A_TYPES__AbstractionDecoratorConfig>
    ) {
        return A_Abstraction.Extend(A_TYPES__ConceptAbstractions.Run, config);
    }

    /**
     *  Start the concept. Uses for servers or any other background services.
     */
    static Start(
        /**
        * provide additional configuration for the abstraction extension to make it dependent on other factors
        */
        config?: Partial<A_TYPES__AbstractionDecoratorConfig>
    ) {
        return A_Abstraction.Extend(A_TYPES__ConceptAbstractions.Start, config);
    }

    /**
     * Stop the concept. Uses for servers or any other background services.
     */
    static Stop(
        /**
        * provide additional configuration for the abstraction extension to make it dependent on other factors
        */
        config?: Partial<A_TYPES__AbstractionDecoratorConfig>
    ) {
        return A_Abstraction.Extend(A_TYPES__ConceptAbstractions.Stop, config);
    }


    /**
     * Name of the concept
     * 
     * By default, the name of the Concept is 'a-concept'
     */
    private _name!: string;
    /**
     * A list of internally defined containers that the concept uses.
     */
    protected _containers!: A_Container[];



    // ==============================================================================
    // ==========================  MAIN Methods  ======================================
    // ==============================================================================


    /**
     * A-Concept is a placeholder for the concept of the any program.
     * 
     * Concept - could be any Program regardless environment and it's goal.
     * It could be mobile, web or simple html page.
     * All depends on Containers and Components installed and provided in the Concept.
     * 
     * 
     * [!] Concept operates ONLY with all Components and Containers provided to achieve the goal.
     * 
     * 
     * @param props - Initialization properties for the Concept
     */
    constructor(
        protected props: A_TYPES__Concept_Init<_Imports>
    ) {
        this._name = props.name || A_Context.root.name;

        if (props.components && props.components.length)
            props.components.forEach(component => this.scope.register(component))

        if (props.fragments && props.fragments.length)
            props.fragments.forEach(fragment => this.scope.register(fragment))

        if (props.entities && props.entities.length)
            props.entities.forEach(entity => this.scope.register(entity as any))


        this._containers = props.containers || [];
    }

    /**
     * Name of the concept
     */
    get name() {
        return A_Context.root.name;
    }
    /**
     * The primary Root scope of the concept.
     */
    get scope() {
        return A_Context.root;
    }

    /**
     * Register a class or value in the concept scope.
     */
    get register(): A_Scope['register'] {
        return this.scope.register.bind(this.scope);
    }

    /**
     * Resolve a class or value from the concept scope.
     */
    get resolve(): A_Scope['resolve'] {
        return this.scope.resolve.bind(this.scope);
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
        const abstraction = new A_Abstraction({
            name: A_TYPES__ConceptAbstractions.Load,
            containers: this._containers,
        });

        await abstraction.process(scope);
    }
    /**
     * Run the concept.
     */
    async run(
        scope?: A_Scope,
    ) {
        const abstraction = new A_Abstraction({
            name: A_TYPES__ConceptAbstractions.Run,
            containers: this._containers,
        });

        await abstraction.process(scope);
    }
    /**
     * Start the concept.
     * 
     * @param params 
     */
    async start(
        scope?: A_Scope,
    ) {
        const abstraction = new A_Abstraction({
            name: A_TYPES__ConceptAbstractions.Start,
            containers: this._containers,
        });

        await abstraction.process(scope);
    }
    /**
     * Stop the concept.
     * 
     * @param params 
     */
    async stop(
        scope?: A_Scope,
    ) {
        const abstraction = new A_Abstraction({
            name: A_TYPES__ConceptAbstractions.Stop,
            containers: this._containers,
        });

        await abstraction.process(scope);
    }
    /**
     * Build the concept.
     */
    async build(
        scope?: A_Scope,
    ) {
        const abstraction = new A_Abstraction({
            name: A_TYPES__ConceptAbstractions.Build,
            containers: this._containers,
        });

        await abstraction.process(scope);
    }
    /**
     * Deploy the concept.
     */
    async deploy(
        scope?: A_Scope,
    ) {
        const abstraction = new A_Abstraction({
            name: A_TYPES__ConceptAbstractions.Deploy,
            containers: this._containers,
        });

        await abstraction.process(scope);

    }
    /**
     * Publish the concept.
     */
    async publish(
        scope?: A_Scope,
    ) {
        const abstraction = new A_Abstraction({
            name: A_TYPES__ConceptAbstractions.Publish,
            containers: this._containers,
        });

        await abstraction.process(scope);
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
        /**
         * Name of the method to call
         */
        method: K[keyof K],
        /**
         * Container in which the method is located
         */
        container: _Imports[number],
    ) {
        const feature = new A_Feature({ name: method, component: container });

        return await feature.process();
    }
}




