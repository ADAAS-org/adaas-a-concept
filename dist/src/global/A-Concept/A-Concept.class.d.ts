import { A_Container } from "../A-Container/A-Container.class";
import { A_Abstraction_Extend } from "../A-Abstraction/A-Abstraction-Extend.decorator";
import { A_Scope } from "../A-Scope/A-Scope.class";
import { A_TYPES__Concept_Init } from "./A-Concept.types";
import { A_TYPES__AbstractionDecoratorConfig } from "../A-Abstraction/A-Abstraction.types";
export declare class A_Concept<_Imports extends A_Container[] = A_Container[]> {
    protected props: A_TYPES__Concept_Init<_Imports>;
    /**
     * Load the concept. This step runs before any other steps to ensure that all components are loaded.
     */
    static Load(
    /**
     * provide additional configuration for the abstraction extension to make it dependent on other factors
     */
    config?: Partial<A_TYPES__AbstractionDecoratorConfig>): ReturnType<typeof A_Abstraction_Extend>;
    /**
     * Publish the concept to ADAAS platform. (Or any other place defined in the concept)
     *
     * [!] To extend the logic just create a custom containers and override the default behavior.
     */
    static Publish(
    /**
    * provide additional configuration for the abstraction extension to make it dependent on other factors
    */
    config?: Partial<A_TYPES__AbstractionDecoratorConfig>): ReturnType<typeof A_Abstraction_Extend>;
    /**
     * Deploy the concept to the environment.
     */
    static Deploy(
    /**
    * provide additional configuration for the abstraction extension to make it dependent on other factors
    */
    config?: Partial<A_TYPES__AbstractionDecoratorConfig>): (target: A_Container | import("../A-Component/A-Component.class").A_Component, propertyKey: string, descriptor: import("../A-Abstraction/A-Abstraction.types").A_TYPES__AbstractionDecoratorDescriptor) => void;
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
    config?: Partial<A_TYPES__AbstractionDecoratorConfig>): (target: A_Container | import("../A-Component/A-Component.class").A_Component, propertyKey: string, descriptor: import("../A-Abstraction/A-Abstraction.types").A_TYPES__AbstractionDecoratorDescriptor) => void;
    /**
     *  Main execution of the concept.
     */
    static Run(
    /**
    * provide additional configuration for the abstraction extension to make it dependent on other factors
    */
    config?: Partial<A_TYPES__AbstractionDecoratorConfig>): (target: A_Container | import("../A-Component/A-Component.class").A_Component, propertyKey: string, descriptor: import("../A-Abstraction/A-Abstraction.types").A_TYPES__AbstractionDecoratorDescriptor) => void;
    /**
     *  Start the concept. Uses for servers or any other background services.
     */
    static Start(
    /**
    * provide additional configuration for the abstraction extension to make it dependent on other factors
    */
    config?: Partial<A_TYPES__AbstractionDecoratorConfig>): (target: A_Container | import("../A-Component/A-Component.class").A_Component, propertyKey: string, descriptor: import("../A-Abstraction/A-Abstraction.types").A_TYPES__AbstractionDecoratorDescriptor) => void;
    /**
     * Stop the concept. Uses for servers or any other background services.
     */
    static Stop(
    /**
    * provide additional configuration for the abstraction extension to make it dependent on other factors
    */
    config?: Partial<A_TYPES__AbstractionDecoratorConfig>): (target: A_Container | import("../A-Component/A-Component.class").A_Component, propertyKey: string, descriptor: import("../A-Abstraction/A-Abstraction.types").A_TYPES__AbstractionDecoratorDescriptor) => void;
    /**
     * Name of the concept
     *
     * By default, the name of the Concept is 'a-concept'
     */
    private _name;
    /**
     * A list of internally defined containers that the concept uses.
     */
    protected _containers: A_Container[];
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
    constructor(props: A_TYPES__Concept_Init<_Imports>);
    /**
     * Name of the concept
     */
    get name(): string;
    /**
     * The primary Root scope of the concept.
     */
    get scope(): A_Scope<import("../A-Component/A-Component.types").A_TYPES__Component_Constructor[], import("../A-Error/A_Error.types").A_TYPES__Error_Constructor[], import("../A-Entity/A-Entity.types").A_TYPES__Entity_Constructor[], import("../A-Fragment/A-Fragment.class").A_Fragment<any>[]>;
    /**
     * Register a class or value in the concept scope.
     */
    get register(): A_Scope['register'];
    /**
     * Resolve a class or value from the concept scope.
     */
    get resolve(): A_Scope['resolve'];
    /**
     * Load the concept.
     */
    load(scope?: A_Scope): Promise<void>;
    /**
     * Run the concept.
     */
    run(scope?: A_Scope): Promise<void>;
    /**
     * Start the concept.
     *
     * @param params
     */
    start(scope?: A_Scope): Promise<void>;
    /**
     * Stop the concept.
     *
     * @param params
     */
    stop(scope?: A_Scope): Promise<void>;
    /**
     * Build the concept.
     */
    build(scope?: A_Scope): Promise<void>;
    /**
     * Deploy the concept.
     */
    deploy(scope?: A_Scope): Promise<void>;
    /**
     * Publish the concept.
     */
    publish(scope?: A_Scope): Promise<void>;
    /**
     * Call the specific method of the concept or included modules.
     */
    call<K extends Record<_Imports[number]['name'], string>>(
    /**
     * Name of the method to call
     */
    method: K[keyof K], 
    /**
     * Container in which the method is located
     */
    container: _Imports[number]): Promise<void>;
}
