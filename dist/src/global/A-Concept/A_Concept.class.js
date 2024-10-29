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
const A_Logger_component_1 = require("../../base/A-Logger/A-Logger.component");
const A_Container_types_1 = require("../A-Container/A-Container.types");
const A_Stage_decorator_1 = require("../../decorators/A-Stage/A-Stage.decorator");
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
    static get Load() {
        return (0, A_Stage_decorator_1.A_Stage)(A_Concept_types_1.A_TYPES__ConceptStage.Load);
    }
    /**
     * Publish the concept to ADAAS platform. (Or any other place defined in the concept)
     *
     * [!] To extend the logic just create a custom containers and override the default behavior.
     */
    static get Publish() {
        return (0, A_Stage_decorator_1.A_Stage)(A_Concept_types_1.A_TYPES__ConceptStage.Publish);
    }
    /**
     * Deploy the concept to the environment.
     */
    static get Deploy() {
        return (0, A_Stage_decorator_1.A_Stage)(A_Concept_types_1.A_TYPES__ConceptStage.Deploy);
    }
    /**
     * Compiles the Concept in case there are some containers that require that.
     *
     * Can be used for static websites or any other concept that requires a build step.
     *
     */
    static get Build() {
        return (0, A_Stage_decorator_1.A_Stage)(A_Concept_types_1.A_TYPES__ConceptStage.Build);
    }
    /**
     *  Main execution of the concept.
     */
    static get Run() {
        return (0, A_Stage_decorator_1.A_Stage)(A_Concept_types_1.A_TYPES__ConceptStage.Run);
    }
    /**
     *  Start the concept. Uses for servers or any other background services.
     */
    static get Start() {
        return (0, A_Stage_decorator_1.A_Stage)(A_Concept_types_1.A_TYPES__ConceptStage.Start);
    }
    /**
     * Stop the concept. Uses for servers or any other background services.
     */
    static get Stop() {
        return (0, A_Stage_decorator_1.A_Stage)(A_Concept_types_1.A_TYPES__ConceptStage.Stop);
    }
    constructor(props) {
        this.props = props;
        // ==============================================================================
        // ==========================  MAIN Class  ======================================
        // ==============================================================================
        this.containers = [];
        A_Context_class_1.A_Context.allocate(this, {
            name: props.name,
            fragments: props.fragments || [],
            // containers: props.containers
            components: [
                A_Logger_component_1.A_Logger,
            ]
        });
        this.containers = props.containers || [];
    }
    get namespace() {
        return A_Context_class_1.A_Context.scope(this).name;
    }
    // =======================================================================
    // ==========================  LIFECYCLE  ================================
    // =======================================================================
    /**
     * Run the concept.
     */
    run(params) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    /**
     * Build the concept.
     */
    build(params) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    // /**
    //  * Deploy the concept.
    //  */
    deploy(params) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    // /**
    //  * Publish the concept.
    //  */
    publish(params) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    /**
     * Call the specific method of the concept or included modules.
     */
    call(container, params) {
        return __awaiter(this, void 0, void 0, function* () {
            // for (const feature of this.features) {
            //     if (methodName in feature) {
            //         (feature as any)[methodName](...args);
            //     }
            // }
        });
    }
    runStage(method, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const stages = [];
            this.containers.map(container => {
                const meta = A_Context_class_1.A_Context.meta(container);
                const containerStages = meta.get(A_Container_types_1.A_TYPES__ContainerMetaKey.STAGES);
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
            const scope = A_Context_class_1.A_Context.allocate(this, {
                components: params.components,
                fragments: params.fragments,
                parent: A_Context_class_1.A_Context.scope(this)
            });
            for (const stage of stages) {
                yield stage.container[stage.name](params);
            }
        });
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