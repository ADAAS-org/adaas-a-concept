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
const A_Context_class_1 = require("../A-Context/A-Context.class");
const A_Container_types_1 = require("../A-Container/A-Container.types");
const A_Abstraction_decorator_1 = require("../../decorators/A-Abstraction/A-Abstraction.decorator");
const A_Feature_class_1 = require("../A-Feature/A-Feature.class");
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
class A_Concept {
    // ==============================================================================
    // ====================  STATIC LIFECYCLE DECORATORS  ===========================
    // ==============================================================================
    /**
     * Load the concept. This step runs before any other steps to ensure that all components are loaded.
     */
    static Load() {
        return (0, A_Abstraction_decorator_1.A_Abstraction)(A_Concept_types_1.A_TYPES__ConceptStage.Load);
    }
    /**
     * Publish the concept to ADAAS platform. (Or any other place defined in the concept)
     *
     * [!] To extend the logic just create a custom containers and override the default behavior.
     */
    static Publish() {
        return (0, A_Abstraction_decorator_1.A_Abstraction)(A_Concept_types_1.A_TYPES__ConceptStage.Publish);
    }
    /**
     * Deploy the concept to the environment.
     */
    static Deploy() {
        return (0, A_Abstraction_decorator_1.A_Abstraction)(A_Concept_types_1.A_TYPES__ConceptStage.Deploy);
    }
    /**
     * Compiles the Concept in case there are some containers that require that.
     *
     * Can be used for static websites or any other concept that requires a build step.
     *
     */
    static Build() {
        return (0, A_Abstraction_decorator_1.A_Abstraction)(A_Concept_types_1.A_TYPES__ConceptStage.Build);
    }
    /**
     *  Main execution of the concept.
     */
    static Run() {
        return (0, A_Abstraction_decorator_1.A_Abstraction)(A_Concept_types_1.A_TYPES__ConceptStage.Run);
    }
    /**
     *  Start the concept. Uses for servers or any other background services.
     */
    static Start() {
        return (0, A_Abstraction_decorator_1.A_Abstraction)(A_Concept_types_1.A_TYPES__ConceptStage.Start);
    }
    /**
     * Stop the concept. Uses for servers or any other background services.
     */
    static Stop() {
        return (0, A_Abstraction_decorator_1.A_Abstraction)(A_Concept_types_1.A_TYPES__ConceptStage.Stop);
    }
    constructor(props) {
        this.props = props;
        // ==============================================================================
        // ==========================  MAIN Methods  ======================================
        // ==============================================================================
        this.containers = [];
        A_Context_class_1.A_Context.allocate(this, {
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
        return A_Context_class_1.A_Context.scope(this).name;
    }
    get Scope() {
        return A_Context_class_1.A_Context.scope(this);
    }
    // =======================================================================
    // ==========================  LIFECYCLE  ================================
    // =======================================================================
    /**
     * Load the concept.
     */
    load(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const definition = this.abstractionDefinition(A_Concept_types_1.A_TYPES__ConceptStage.Load, params);
            const abstraction = new A_Feature_class_1.A_Feature(definition);
            yield abstraction.process();
        });
    }
    /**
     * Run the concept.
     */
    run(params) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.load(params);
            const definition = this.abstractionDefinition(A_Concept_types_1.A_TYPES__ConceptStage.Run, params);
            const abstraction = new A_Feature_class_1.A_Feature(definition);
            yield abstraction.process();
        });
    }
    /**
     * Start the concept.
     *
     * @param params
     */
    start(params) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.load(params);
            const definition = this.abstractionDefinition(A_Concept_types_1.A_TYPES__ConceptStage.Start, params);
            const abstraction = new A_Feature_class_1.A_Feature(definition);
            yield abstraction.process();
        });
    }
    /**
     * Stop the concept.
     *
     * @param params
     */
    stop(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const definition = this.abstractionDefinition(A_Concept_types_1.A_TYPES__ConceptStage.Stop, params);
            const abstraction = new A_Feature_class_1.A_Feature(definition);
            yield abstraction.process();
        });
    }
    /**
     * Build the concept.
     */
    build(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const definition = this.abstractionDefinition(A_Concept_types_1.A_TYPES__ConceptStage.Build, params);
            const abstraction = new A_Feature_class_1.A_Feature(definition);
            yield abstraction.process();
        });
    }
    /**
     * Deploy the concept.
     */
    deploy(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const definition = this.abstractionDefinition(A_Concept_types_1.A_TYPES__ConceptStage.Deploy, params);
            const abstraction = new A_Feature_class_1.A_Feature(definition);
            yield abstraction.process();
        });
    }
    /**
     * Publish the concept.
     */
    publish(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const definition = this.abstractionDefinition(A_Concept_types_1.A_TYPES__ConceptStage.Publish, params);
            const abstraction = new A_Feature_class_1.A_Feature(definition);
            yield abstraction.process();
        });
    }
    // =======================================================================
    // ==========================  CALL  =====================================
    // =======================================================================
    /**
     * Call the specific method of the concept or included modules.
     */
    call(container, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const definition = this.abstractionDefinition(A_Concept_types_1.A_TYPES__ConceptStage.Run, {
                components: params === null || params === void 0 ? void 0 : params.components,
                fragments: params === null || params === void 0 ? void 0 : params.fragments,
            });
            const feature = new A_Feature_class_1.A_Feature(definition);
            yield feature.process();
        });
    }
    abstractionDefinition(method, params) {
        const abstractionSteps = [];
        this.containers.map(container => {
            const meta = A_Context_class_1.A_Context.meta(container);
            const containerAbstractions = meta
                .abstractions(method)
                .map(step => (Object.assign({ component: container }, step)));
            const containerScope = A_Context_class_1.A_Context.scope(container);
            const componentsAbstractions = containerScope
                .components
                .map(component => A_Context_class_1.A_Context.meta(component).abstractions(method).map(step => (Object.assign({ component }, step))))
                .flat();
            abstractionSteps.push(...containerAbstractions.map(step => (Object.assign(Object.assign({}, step), { component: container }))), ...componentsAbstractions);
        });
        return Object.assign(Object.assign({}, params), { name: `${this.namespace}.${method}`, steps: abstractionSteps, parent: this.Scope, components: (params === null || params === void 0 ? void 0 : params.components) || [], fragments: (params === null || params === void 0 ? void 0 : params.fragments) || [] });
    }
    execute(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const fragments = params.fragments || [];
            const component = params.components || [];
            this.containers.map(container => {
                const meta = A_Context_class_1.A_Context.meta(container);
                meta.get(A_Container_types_1.A_TYPES__ContainerMetaKey.FEATURES);
            });
        });
    }
}
exports.A_Concept = A_Concept;
//# sourceMappingURL=A_Concept.class.js.map