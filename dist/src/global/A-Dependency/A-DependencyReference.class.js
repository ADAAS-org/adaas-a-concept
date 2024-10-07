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
class RealDependency {
    constructor(name) {
        this.name = name;
    }
    getName() {
        return this.name;
    }
    performAction() {
        console.log(`${this.name} is performing an action.`);
    }
}
class DependencyReference {
    constructor(realClass, args) {
        this.realClass = realClass;
        this.args = args;
        this.proxyInstance = null;
        this.realInstance = null;
    }
    // Simulate async loading (e.g., dynamic imports, API calls, etc.)
    loadInstance() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.realInstance) {
                console.log('Loading real dependency...');
                // Simulate async loading with a delay
                yield new Promise((resolve) => setTimeout(resolve, 1000));
                this.realInstance = new this.realClass(...this.args);
            }
            return this.realInstance;
        });
    }
    resolve() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.proxyInstance) {
                const realInstance = yield this.loadInstance();
                this.proxyInstance = new Proxy({}, {
                    get: (target, prop) => {
                        const value = realInstance[prop];
                        // If the property is a method, return a bound function
                        if (typeof value === 'function') {
                            return value.bind(realInstance);
                        }
                        return value;
                    }
                });
            }
            return this.proxyInstance;
        });
    }
}
// Example usage:
(() => __awaiter(void 0, void 0, void 0, function* () {
    const lazyDependency = new DependencyReference(RealDependency, ['ComponentA']);
    const proxy = yield lazyDependency.resolve(); // Loads the instance asynchronously
    proxy.performAction(); // Will call the method on the real instance
    console.log(proxy.getName()); // Calls method on the real instance
}))();
//# sourceMappingURL=A-DependencyReference.class.js.map