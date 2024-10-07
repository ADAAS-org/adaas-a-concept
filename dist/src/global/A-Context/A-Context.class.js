"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_Context = void 0;
const a_utils_1 = require("@adaas/a-utils");
const A_Namespace_class_1 = require("../A-Namespace/A_Namespace.class");
const A_Component_class_1 = require("../A-Component/A-Component.class");
/**
 * Namespace Provider is responsible for providing the Namespace to the Containers and other Namespaces.
 * This class stores all Namespaces across the Program.
 *
 * Namespace provider is a singleton class that is used to store all the Namespaces in the program.
 *
 */
class A_Context {
    constructor() {
        /**
         * Stores all the Namespaces by namespace.
         * There might be a Namespaces of the same type but with different namespaces.
         * That might be useful for the cases when you need to have multiple instances of the same Namespace e.g.
         * - multiple http servers
         * - multitenant applications
         * - etc.
         */
        this.namespaced = new Map();
        /**
         * Stores the singleton Namespaces.
         * Singleton Namespaces are the Namespaces that are used only once in the program.
         * In most cases, the singleton Namespace is the main Namespace of the program.
         * It could be :
         * - the main Namespace of the Program
         * - the authentication Namespace
         * - the main database Namespace
         * - etc.
         */
        this.singleton = new WeakMap();
        /**
         * Stores the components that are used in the program.
         */
        this.components = new Map();
    }
    /**
     * Get the instance of the Namespace Provider.
     *
     * @returns
     */
    static getInstance() {
        if (!A_Context.instance) {
            A_Context.instance = new A_Context();
        }
        return A_Context.instance;
    }
    static get root() {
        return this.getInstance()._root;
    }
    static get environment() {
        return a_utils_1.A_Polyfills.env;
    }
    static register(param1, param2) {
        const instance = this.getInstance();
        let Namespace;
        let namespace;
        if (typeof param2 === 'string') {
            namespace = param2;
            Namespace = param1;
        }
        else {
            Namespace = param1;
            namespace = Namespace.name;
        }
        /**
         * If the namespace is not provided, then use the root namespace.
         * If the root namespace is not provided, then use the default namespace.
         */
        if (!namespace)
            namespace = this.root
                || process.env.ADAAS_NAMESPACE
                || process.env.A_NAMESPACE
                || process.env.ADAAS_APP_NAMESPACE
                || 'a-concept';
        if (!this.root)
            instance._root = namespace;
        instance.namespaced.set(namespace, Namespace);
        return namespace;
    }
    /**
     * Get the Namespace by namespace.
     * @param namespace
     */
    static get(namespace) {
        const instance = this.getInstance();
        return instance.namespaced.get(namespace);
    }
    static resolve(param1, param2) {
        switch (true) {
            // If the first parameter is a Namespace 
            case Array.isArray(param1) && param1.every(namespace => a_utils_1.A_CommonHelper.isInheritedFrom(namespace, A_Namespace_class_1.A_Namespace)):
                return param1.map(namespace => this.resolveNamespace(namespace));
            // If the first parameter is a Namespace and the second parameter is a string
            case !!param2 && typeof param1 === 'function' && a_utils_1.A_CommonHelper.isInheritedFrom(param1, A_Namespace_class_1.A_Namespace):
                return this.resolveNamespace(param1, param2);
            // If the first parameter is a Component
            case !!param2 && typeof param1 === 'function' && a_utils_1.A_CommonHelper.isInheritedFrom(param1, A_Component_class_1.A_Component):
                return this.resolveComponent(param1);
            default:
                throw new Error(`[!] A-Concept Context: Unknown type of the parameter.`);
        }
    }
    static resolveComponent(component) {
        const instance = this.getInstance();
        return instance.components.get(component.name);
    }
    static resolveNamespace(param1, param2) {
        const instance = this.getInstance();
        return instance.namespaced.get(param2 || param1.name);
    }
}
exports.A_Context = A_Context;
//# sourceMappingURL=A-Context.class.js.map