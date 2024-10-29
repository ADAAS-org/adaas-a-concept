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
exports.A_Fragment = void 0;
const A_Context_class_1 = require("../A-Context/A-Context.class");
/**
 * A-Fragment = Context Fragments is a set of arguments that can be used to define a Context for the pipeline.
 * In other words it is a dynamic context that will be created on pipeline start and destroyed on pipeline end.
 * During the execution of the pipeline, the Context Fragments can be used to pass the data between the pipeline steps.
 *
 * Or to store the data that is required for the pipeline execution
 *
 */
class A_Fragment {
    constructor(params = {}) {
        this.name = params.name || this.constructor.name;
        /**
         * Register the Namespace in the global Namespace provider
         */
        this.name = A_Context_class_1.A_Context
            .register(this, this.name);
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
     * Main initialization method for the SDK
     */
    onInit() {
        return __awaiter(this, void 0, void 0, function* () {
            // global logger configuration
            if (A_Context_class_1.A_Context.environment === 'server' && !this.hasInherited(A_Fragment)) {
                // eslint-disable-next-line no-use-before-define
                // process.on('uncaughtException', (error) => {
                //     // log only in case of A_AUTH_Error
                //     if (error instanceof A_Error)
                //         this.Logger.error(error);
                // });
                // // eslint-disable-next-line no-use-before-define
                // process.on('unhandledRejection', (error) => {
                //     if (error instanceof A_Error)
                //         this.Logger.error(error);
                // });
            }
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
exports.A_Fragment = A_Fragment;
//# sourceMappingURL=A-Fragment.class.js.map