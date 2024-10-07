"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_Container = void 0;
/**
 * This class should combine Components to achieve the goal withing Context
 * Container could be interpreted as any Structure Entity, or Abstract Entity
 * For example:
 * - Controller (all Controllers with base logic)
 * - Service (all Services with base logic)
 * - Module (all Modules with base logic)
 * - etc.
 */
class A_Container {
    constructor(namespace) {
        if (namespace) {
            this.namespace = namespace;
        }
    }
}
exports.A_Container = A_Container;
//# sourceMappingURL=A-Container.class.js.map