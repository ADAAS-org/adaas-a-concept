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
exports.A_Container = void 0;
const A_Feature_class_1 = require("../A-Feature/A-Feature.class");
const A_Context_class_1 = require("../A-Context/A-Context.class");
/**
 * This class should combine Components to achieve the goal withing Concept
 *
 * Container is a direct container that should be "run" to make Concept work.
 * So because of that Container can be:
 * - HTTP Server
 * - BASH Script
 * - Database Connection
 * - Microservice
 * - etc.
 */
class A_Container {
    get exports() {
        return this.config.exports || [];
    }
    get name() {
        return this.config.name || this.constructor.name;
    }
    constructor(
    /**
     * Configuration of the container that will be used to run it.
     */
    config) {
        this.config = config;
        const components = config.components || [];
        const fragments = config.fragments || [];
        A_Context_class_1.A_Context.allocate(this, {
            components,
            fragments
        });
        /**
         * Run Async Initialization
         */
        this.init();
    }
    hasInherited(cl) {
        return this.constructor === cl
            ? false
            : true;
    }
    /**
     * Initializes the Namespace or can be used to reinitialize the Namespace
     */
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.ready)
                this.ready = new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        yield this.onBeforeInit();
                        yield this.onInit();
                        yield this.onAfterInit();
                        return resolve();
                    }
                    catch (error) {
                        return reject(error);
                    }
                }));
            else
                yield this.ready;
        });
    }
    call(param1, param2) {
        let feature;
        let params;
        if (typeof param1 === 'string') {
            feature = param1;
            params = param2 || {};
        }
        else {
            feature = param1.name;
            params = param1;
        }
        const meta = A_Context_class_1.A_Context.meta(this);
        const steps = meta.feature(this, feature);
        const newFeature = new A_Feature_class_1.A_Feature({
            name: `${this.constructor.name}.${feature}`,
            fragments: (param2 === null || param2 === void 0 ? void 0 : param2.fragments) || [],
            components: (param2 === null || param2 === void 0 ? void 0 : param2.components) || [],
            steps,
            parent: A_Context_class_1.A_Context.scope(this)
        });
        return newFeature;
    }
    // ==============================================================
    // ======================= HOOKS ================================
    // ==============================================================
    /**
     *  Before init hook to be used in inherited classes
     *
     * @returns
     */
    onBeforeInit() {
        return __awaiter(this, void 0, void 0, function* () {
            return;
        });
    }
    /**
     * Main initialization method for the Container
     */
    onInit() {
        return __awaiter(this, void 0, void 0, function* () {
            return;
        });
    }
    /**
     *  After init hook to be used in inherited classes
     *
     * @returns
     */
    onAfterInit() {
        return __awaiter(this, void 0, void 0, function* () {
            return;
        });
    }
}
exports.A_Container = A_Container;
//# sourceMappingURL=A-Container.class.js.map