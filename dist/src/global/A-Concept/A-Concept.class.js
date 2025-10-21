"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_Concept = void 0;
const A_Abstraction_class_1 = require("../A-Abstraction/A-Abstraction.class");
const A_Context_class_1 = require("../A-Context/A-Context.class");
const A_Concept_constants_1 = require("./A-Concept.constants");
const A_Feature_class_1 = require("../A-Feature/A-Feature.class");
class A_Concept {
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
    config) {
        return A_Abstraction_class_1.A_Abstraction.Extend(A_Concept_constants_1.A_TYPES__ConceptAbstractions.Load, config);
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
    config) {
        return A_Abstraction_class_1.A_Abstraction.Extend(A_Concept_constants_1.A_TYPES__ConceptAbstractions.Publish);
    }
    /**
     * Deploy the concept to the environment.
     */
    static Deploy(
    /**
    * provide additional configuration for the abstraction extension to make it dependent on other factors
    */
    config) {
        return A_Abstraction_class_1.A_Abstraction.Extend(A_Concept_constants_1.A_TYPES__ConceptAbstractions.Deploy, config);
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
    config) {
        return A_Abstraction_class_1.A_Abstraction.Extend(A_Concept_constants_1.A_TYPES__ConceptAbstractions.Build, config);
    }
    /**
     *  Main execution of the concept.
     */
    static Run(
    /**
    * provide additional configuration for the abstraction extension to make it dependent on other factors
    */
    config) {
        return A_Abstraction_class_1.A_Abstraction.Extend(A_Concept_constants_1.A_TYPES__ConceptAbstractions.Run, config);
    }
    /**
     *  Start the concept. Uses for servers or any other background services.
     */
    static Start(
    /**
    * provide additional configuration for the abstraction extension to make it dependent on other factors
    */
    config) {
        return A_Abstraction_class_1.A_Abstraction.Extend(A_Concept_constants_1.A_TYPES__ConceptAbstractions.Start, config);
    }
    /**
     * Stop the concept. Uses for servers or any other background services.
     */
    static Stop(
    /**
    * provide additional configuration for the abstraction extension to make it dependent on other factors
    */
    config) {
        return A_Abstraction_class_1.A_Abstraction.Extend(A_Concept_constants_1.A_TYPES__ConceptAbstractions.Stop, config);
    }
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
    constructor(props) {
        this.props = props;
        this._name = props.name || A_Context_class_1.A_Context.root.name;
        if (props.components && props.components.length)
            props.components.forEach(component => this.scope.register(component));
        if (props.fragments && props.fragments.length)
            props.fragments.forEach(fragment => this.scope.register(fragment));
        if (props.entities && props.entities.length)
            props.entities.forEach(entity => this.scope.register(entity));
        this._containers = props.containers || [];
    }
    /**
     * Name of the concept
     */
    get name() {
        return A_Context_class_1.A_Context.root.name;
    }
    /**
     * The primary Root scope of the concept.
     */
    get scope() {
        return A_Context_class_1.A_Context.root;
    }
    /**
     * Register a class or value in the concept scope.
     */
    get register() {
        return this.scope.register.bind(this.scope);
    }
    /**
     * Resolve a class or value from the concept scope.
     */
    get resolve() {
        return this.scope.resolve.bind(this.scope);
    }
    // =======================================================================
    // ==========================  LIFECYCLE  ================================
    // =======================================================================
    /**
     * Load the concept.
     */
    load(scope) {
        return __awaiter(this, void 0, void 0, function* () {
            const abstraction = new A_Abstraction_class_1.A_Abstraction({
                name: A_Concept_constants_1.A_TYPES__ConceptAbstractions.Load,
                containers: this._containers,
            });
            yield abstraction.process(scope);
        });
    }
    /**
     * Run the concept.
     */
    run(scope) {
        return __awaiter(this, void 0, void 0, function* () {
            const abstraction = new A_Abstraction_class_1.A_Abstraction({
                name: A_Concept_constants_1.A_TYPES__ConceptAbstractions.Run,
                containers: this._containers,
            });
            yield abstraction.process(scope);
        });
    }
    /**
     * Start the concept.
     *
     * @param params
     */
    start(scope) {
        return __awaiter(this, void 0, void 0, function* () {
            const abstraction = new A_Abstraction_class_1.A_Abstraction({
                name: A_Concept_constants_1.A_TYPES__ConceptAbstractions.Start,
                containers: this._containers,
            });
            yield abstraction.process(scope);
        });
    }
    /**
     * Stop the concept.
     *
     * @param params
     */
    stop(scope) {
        return __awaiter(this, void 0, void 0, function* () {
            const abstraction = new A_Abstraction_class_1.A_Abstraction({
                name: A_Concept_constants_1.A_TYPES__ConceptAbstractions.Stop,
                containers: this._containers,
            });
            yield abstraction.process(scope);
        });
    }
    /**
     * Build the concept.
     */
    build(scope) {
        return __awaiter(this, void 0, void 0, function* () {
            const abstraction = new A_Abstraction_class_1.A_Abstraction({
                name: A_Concept_constants_1.A_TYPES__ConceptAbstractions.Build,
                containers: this._containers,
            });
            yield abstraction.process(scope);
        });
    }
    /**
     * Deploy the concept.
     */
    deploy(scope) {
        return __awaiter(this, void 0, void 0, function* () {
            const abstraction = new A_Abstraction_class_1.A_Abstraction({
                name: A_Concept_constants_1.A_TYPES__ConceptAbstractions.Deploy,
                containers: this._containers,
            });
            yield abstraction.process(scope);
        });
    }
    /**
     * Publish the concept.
     */
    publish(scope) {
        return __awaiter(this, void 0, void 0, function* () {
            const abstraction = new A_Abstraction_class_1.A_Abstraction({
                name: A_Concept_constants_1.A_TYPES__ConceptAbstractions.Publish,
                containers: this._containers,
            });
            yield abstraction.process(scope);
        });
    }
    // =======================================================================
    // ==========================  CALL  =====================================
    // =======================================================================
    /**
     * Call the specific method of the concept or included modules.
     */
    call(
    /**
     * Name of the method to call
     */
    method, 
    /**
     * Container in which the method is located
     */
    container) {
        return __awaiter(this, void 0, void 0, function* () {
            const feature = new A_Feature_class_1.A_Feature({ name: method, component: container });
            return yield feature.process();
        });
    }
}
exports.A_Concept = A_Concept;
//# sourceMappingURL=A-Concept.class.js.map