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
const A_Concept_types_1 = require("./A_Concept.types");
const A_Abstraction_class_1 = require("../A-Abstraction/A-Abstraction.class");
const A_Context_class_1 = require("../A-Context/A-Context.class");
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
class A_Concept {
    // ==============================================================================
    // ====================  STATIC LIFECYCLE DECORATORS  ===========================
    // ==============================================================================
    /**
     * Load the concept. This step runs before any other steps to ensure that all components are loaded.
     */
    static Load() {
        return A_Abstraction_class_1.A_Abstraction.Extend(A_Concept_types_1.A_TYPES__ConceptStage.Load);
    }
    /**
     * Publish the concept to ADAAS platform. (Or any other place defined in the concept)
     *
     * [!] To extend the logic just create a custom containers and override the default behavior.
     */
    static Publish() {
        return A_Abstraction_class_1.A_Abstraction.Extend(A_Concept_types_1.A_TYPES__ConceptStage.Publish);
    }
    /**
     * Deploy the concept to the environment.
     */
    static Deploy() {
        return A_Abstraction_class_1.A_Abstraction.Extend(A_Concept_types_1.A_TYPES__ConceptStage.Deploy);
    }
    /**
     * Compiles the Concept in case there are some containers that require that.
     *
     * Can be used for static websites or any other concept that requires a build step.
     *
     */
    static Build() {
        return A_Abstraction_class_1.A_Abstraction.Extend(A_Concept_types_1.A_TYPES__ConceptStage.Build);
    }
    /**
     *  Main execution of the concept.
     */
    static Run() {
        return A_Abstraction_class_1.A_Abstraction.Extend(A_Concept_types_1.A_TYPES__ConceptStage.Run);
    }
    /**
     *  Start the concept. Uses for servers or any other background services.
     */
    static Start() {
        return A_Abstraction_class_1.A_Abstraction.Extend(A_Concept_types_1.A_TYPES__ConceptStage.Start);
    }
    /**
     * Stop the concept. Uses for servers or any other background services.
     */
    static Stop() {
        return A_Abstraction_class_1.A_Abstraction.Extend(A_Concept_types_1.A_TYPES__ConceptStage.Stop);
    }
    constructor(props) {
        this.props = props;
        this._name = props.name || A_Context_class_1.A_Context.root.name;
        if (props.components && props.components.length)
            props.components.forEach(component => this.Scope.register(component));
        if (props.fragments && props.fragments.length)
            props.fragments.forEach(fragment => this.Scope.register(fragment));
        if (props.entities && props.entities.length)
            props.entities.forEach(entity => this.Scope.register(entity));
        this.containers = props.containers || [];
    }
    get namespace() {
        return A_Context_class_1.A_Context.root.name;
    }
    get Scope() {
        return A_Context_class_1.A_Context.root;
    }
    /**
     * Register a class or value in the concept scope.
     */
    get register() {
        return this.Scope.register.bind(this.Scope);
    }
    /**
     * Resolve a class or value from the concept scope.
     */
    get resolve() {
        return this.Scope.resolve.bind(this.Scope);
    }
    // =======================================================================
    // ==========================  LIFECYCLE  ================================
    // =======================================================================
    /**
     * Load the concept.
     */
    load(scope) {
        return __awaiter(this, void 0, void 0, function* () {
            scope = scope ? scope.inherit(this.Scope) : this.Scope;
            const abstraction = this.abstraction(A_Concept_types_1.A_TYPES__ConceptStage.Load, scope);
            yield abstraction.process();
        });
    }
    /**
     * Run the concept.
     */
    run(scope) {
        return __awaiter(this, void 0, void 0, function* () {
            scope = scope ? scope.inherit(this.Scope) : this.Scope;
            const abstraction = this.abstraction(A_Concept_types_1.A_TYPES__ConceptStage.Run, scope);
            yield abstraction.process();
        });
    }
    /**
     * Start the concept.
     *
     * @param params
     */
    start(scope) {
        return __awaiter(this, void 0, void 0, function* () {
            scope = scope ? scope.inherit(this.Scope) : this.Scope;
            const abstraction = this.abstraction(A_Concept_types_1.A_TYPES__ConceptStage.Start, scope);
            yield abstraction.process();
        });
    }
    /**
     * Stop the concept.
     *
     * @param params
     */
    stop(scope) {
        return __awaiter(this, void 0, void 0, function* () {
            scope = scope ? scope.inherit(this.Scope) : this.Scope;
            const abstraction = this.abstraction(A_Concept_types_1.A_TYPES__ConceptStage.Stop, scope);
            yield abstraction.process();
        });
    }
    /**
     * Build the concept.
     */
    build(scope) {
        return __awaiter(this, void 0, void 0, function* () {
            scope = scope ? scope.inherit(this.Scope) : this.Scope;
            const abstraction = this.abstraction(A_Concept_types_1.A_TYPES__ConceptStage.Build, scope);
            yield abstraction.process();
        });
    }
    /**
     * Deploy the concept.
     */
    deploy(scope) {
        return __awaiter(this, void 0, void 0, function* () {
            scope = scope ? scope.inherit(this.Scope) : this.Scope;
            const abstraction = this.abstraction(A_Concept_types_1.A_TYPES__ConceptStage.Deploy, scope);
            yield abstraction.process();
        });
    }
    /**
     * Publish the concept.
     */
    publish(scope) {
        return __awaiter(this, void 0, void 0, function* () {
            scope = scope ? scope.inherit(this.Scope) : this.Scope;
            const abstraction = this.abstraction(A_Concept_types_1.A_TYPES__ConceptStage.Publish, scope);
            yield abstraction.process();
        });
    }
    // =======================================================================
    // ==========================  CALL  =====================================
    // =======================================================================
    /**
     * Call the specific method of the concept or included modules.
     */
    call(container) {
        return __awaiter(this, void 0, void 0, function* () {
            // const definition = this.meta.abstractionDefinition(A_TYPES__ConceptStage.Run, {
            //     components: params?.components,
            //     fragments: params?.fragments,
            // });
            // const feature = new A_Feature(definition);
            // await feature.process();
        });
    }
    abstraction(method, scope) {
        const featureDefinitions = this.containers.map(container => {
            const definition = A_Context_class_1.A_Context.abstractionDefinition(container, method, container.Scope);
            return Object.assign(Object.assign({}, definition), { steps: definition.steps.map(step => (Object.assign(Object.assign({}, step), { component: step.component ? step.component : container }))) });
        });
        const definition = {
            name: `${this.namespace}.${method}`,
            features: featureDefinitions,
            scope
        };
        return new A_Abstraction_class_1.A_Abstraction(definition);
    }
}
exports.A_Concept = A_Concept;
//# sourceMappingURL=A_Concept.class.js.map