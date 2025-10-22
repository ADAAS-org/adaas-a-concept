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
const A_Context_class_1 = require("../A-Context/A-Context.class");
const A_Feature_class_1 = require("../A-Feature/A-Feature.class");
class A_Container {
    /**
     * Name of the container
     */
    get name() {
        return this.config.name || this.constructor.name;
    }
    /**
     * Returns the scope where the container is registered
     */
    get scope() {
        return A_Context_class_1.A_Context.scope(this);
    }
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
     *
     * @param config - Configuration of the container that will be used to run it.
     */
    constructor(
    /**
     * Configuration of the container that will be used to run it.
     */
    config = {}) {
        this.config = config;
        A_Context_class_1.A_Context.allocate(this, this.config);
    }
    /**
     * Calls the feature with the given name in the given scope
     *
     * [!] Note: This method creates a new instance of the feature every time it is called
     *
     * @param feature - the name of the feature to call
     * @param scope  - the scope in which to call the feature
     * @returns  - void
     */
    call(
    /**
     * Name of the feature to call
     */
    feature, 
    /**
     * scope in which the feature will be executed
     */
    scope) {
        return __awaiter(this, void 0, void 0, function* () {
            const newFeature = new A_Feature_class_1.A_Feature({
                name: feature,
                component: this
            });
            return yield newFeature.process(scope);
        });
    }
}
exports.A_Container = A_Container;
//# sourceMappingURL=A-Container.class.js.map