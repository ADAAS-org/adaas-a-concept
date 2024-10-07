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
exports.A_DependencyManager = void 0;
const A_Namespace_class_1 = require("../global/A-Namespace/A_Namespace.class");
const A_Module_class_1 = require("../global/A_Module.class");
class A_DependencyManager {
    constructor(concept, dependencies) {
        this.dependencies = [];
        this.Concept = concept;
        this.dependencies = dependencies;
    }
    add(dependency) {
        this.dependencies.push(dependency);
    }
    resolve(param1) {
        return __awaiter(this, void 0, void 0, function* () {
            let dependencies = [
                ...(Array.isArray(param1) ? param1 : [param1])
            ];
            const resolvedDependencies = [];
            for (const dependency of dependencies) {
                switch (true) {
                    case dependency instanceof A_Module_class_1.A_Module:
                        resolvedDependencies.push(yield this.resolveModule(dependency));
                        break;
                    case dependency instanceof A_Namespace_class_1.A_Context:
                        resolvedDependencies.push(yield this.resolveContext(dependency));
                        break;
                    default:
                        throw new Error(`[!] A-Concept Dependency Manager: Unknown dependency type.`);
                }
            }
            return Array.isArray(param1) ? resolvedDependencies : resolvedDependencies[0];
        });
    }
    resolveModule(module) {
        return __awaiter(this, void 0, void 0, function* () {
            const resolvedDependencies = yield this.resolveDependencies(module.dependencies);
            return yield module.init(resolvedDependencies);
        });
    }
    resolveContext(context) {
        return __awaiter(this, void 0, void 0, function* () {
            const resolvedDependencies = yield this.resolveDependencies(context.dependencies);
            return yield context.init(resolvedDependencies);
        });
    }
    hasModule(moduleConstructor) {
        const targetModule = this.modules.get(moduleConstructor);
        return !!targetModule;
    }
    useModule(module) {
        const existedModule = this.modules.get(A_SDK_Module.constructor);
        if (!existedModule) {
            module.useContext(this.context);
            this.modules.set(A_SDK_Module.constructor, module);
        }
        this.context.Logger.warning(`[!] A-Express Module of type ${module.constructor} already included.`);
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.ready) {
                this.ready = new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        for (const dependency of this.dependencies) {
                            // await this.activateModuleWithDependencies(instance);
                            const { source } = dependency;
                            const targetInstance = new source();
                        }
                        /**
                         * Then we have to ensure that all modules are loaded even if some has async behavior
                         * To do this we have to wait for all modules to be ready before resolving the promise
                         *
                         * TODO: maybe it's not a case
                         */
                        // this.readyStateInterval = setInterval(() => {
                        //     if (!this.checkingReadyState()) {
                        //         clearInterval(this.readyStateInterval);
                        //         resolve();
                        //     }
                        // }, 1000);
                        return resolve();
                    }
                    catch (error) {
                        this.context.Logger.error(`[!] A-SDK Dependency Manager activation failed with Error: `, error);
                        reject(error);
                    }
                }));
            }
            return this.activationPromise;
        });
    }
    // Recursively activate a module and its dependencies
    activateModuleWithDependencies(module_1) {
        return __awaiter(this, arguments, void 0, function* (module, path = []) {
            if (this.activatedModules.has(module.constructor)) {
                // Module is already activated
                return;
            }
            if (path.includes(module.constructor)) {
                throw new Error(`Circular dependency detected: ${[...path, module.constructor].join(' -> ')}`);
            }
            // Recursively activate dependencies first
            for (const dependency of module.dependencies) {
                const dependencyModule = this.modules.get(dependency);
                if (!dependencyModule) {
                    this.context.Logger.warning(`[!] Missing dependency: ${dependency.constructor} for module ${module.constructor}`, `    Module ${dependency.constructor} initialization will be skipped...`);
                }
                else {
                    yield this.activateModuleWithDependencies(dependencyModule, [...path, module.constructor]);
                }
            }
            // Activate the module itself
            yield module.load();
            this.activatedModules.add(module.constructor);
        });
    }
}
exports.A_DependencyManager = A_DependencyManager;
//# sourceMappingURL=A_DependencyManager.class.js.map