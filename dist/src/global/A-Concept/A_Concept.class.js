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
const A_Context_class_1 = require("../A-Context/A-Context.class");
const A_Errors_namespace_1 = require("src/containers/A-Errors/A-Errors.namespace");
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
    constructor(props) {
        this.props = props;
        this.Context = A_Context_class_1.A_Context;
    }
    get namespace() {
        return this.Context.root;
    }
    /**
     * Returns true if the class has inherited from the given class.
     *
     * @param cl
     * @returns
     */
    hasInherited(cl) {
        return this.constructor === cl
            ? false
            : true;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            // await this.Context.init();
            // await this.DM.init();
        });
    }
    // =======================================================================
    // ==========================  LIFECYCLE  ================================
    // =======================================================================
    /**
     * Run the concept.
     */
    run() {
        return __awaiter(this, arguments, void 0, function* (params = {}) {
            //  to prevent modification of the method parameters use the A_Context directly without decorators 
            const [Errors] = this.Context.resolve([A_Errors_namespace_1.A_Errors]);
            if (this.hasInherited(A_Concept))
                Errors.throw('[root.run] method can not be overridden in the inherited classes');
            // const allRunDeclarations = A_CONCEPT_LifecycleDeclarationsStorage
            //     .get(A_CONCEPT_STORAGE__DECORATORS_RUN_DECLARATIONS);
        });
    }
    /**
     * Build the concept.
     */
    build() {
        return __awaiter(this, void 0, void 0, function* () {
            //  to prevent modification of the method parameters use the A_Context directly without decorators 
            const [Errors] = this.Context.resolve([A_Errors_namespace_1.A_Errors]);
            if (this.hasInherited(A_Concept))
                Errors.throw('[root.build] method can not be overridden in the inherited classes');
        });
    }
    // /**
    //  * Deploy the concept.
    //  */
    // async deploy() {
    //     if (this.hasInherited(A_Concept))
    //         this.Context.Errors.throw('[root.deploy] method can not be overridden in the inherited classes');
    // }
    // /**
    //  * Publish the concept.
    //  */
    // async publish() {
    //     if (this.hasInherited(A_Concept))
    //         this.Context.Errors.throw('[root.publish] method can not be overridden in the inherited classes');
    // }
    /**
     * Call the specific method of the concept or included modules.
     */
    call() {
        return __awaiter(this, void 0, void 0, function* () {
            //  to prevent modification of the method parameters use the A_Context directly without decorators 
            const [Errors] = this.Context.resolve([A_Errors_namespace_1.A_Errors]);
            // if (this.hasInherited(A_Concept))
            //     this.Context.Errors.throw('[root.call] method can not be overridden in the inherited classes');
        });
    }
}
exports.A_Concept = A_Concept;
//# sourceMappingURL=A_Concept.class.js.map