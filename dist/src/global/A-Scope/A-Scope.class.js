"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_Scope = void 0;
const a_utils_1 = require("@adaas/a-utils");
const A_Fragment_class_1 = require("../A-Fragment/A-Fragment.class");
const A_Context_class_1 = require("../A-Context/A-Context.class");
const A_Component_types_1 = require("../A-Component/A-Component.types");
const A_Component_class_1 = require("../A-Component/A-Component.class");
const A_Entity_class_1 = require("../A-Entity/A-Entity.class");
/**
 *
 *
 * A_Scope refers to the visibility and accessibility of :
 * - variables,
 * - Components,
 * - Context Fragments
 * - and objects in different parts of your code.
 * Scope determines where a particular piece of data (like a variable or function)
 * can be accessed, modified, or referenced, and it plays a crucial role in avoiding naming collisions and ensuring data integrity.
 *
 *
 */
class A_Scope {
    constructor(params, config = {}) {
        this.name = '';
        this._components = new WeakMap();
        this._fragments = new WeakMap();
        this._entities = new Map();
        this.name = params.name || this.constructor.name;
        // TODO: move to defaults
        const defaultParams = {
            name: '',
            components: [],
            fragments: [],
            entities: [],
        };
        this.params = Object.assign(Object.assign({}, defaultParams), params);
        this.initComponents(params.components || []);
        this.initFragments(params.fragments || []);
        this.initEntities(params.entities || []);
        if (config.parent) {
            this._parent = config.parent;
        }
    }
    initComponents(_components) {
        // _components.forEach(component => {
        //     this._components.set(component, new component());
        // })
    }
    initEntities(_entities) {
        _entities.forEach(this.register.bind(this));
    }
    initFragments(_fragments) {
        _fragments.forEach(this.register.bind(this));
    }
    get components() {
        return this.params.components || [];
    }
    get fragments() {
        return this.params.fragments || [];
    }
    parent(setValue) {
        if (setValue) {
            return this.inherit(setValue);
        }
        return this._parent;
    }
    isInheritedFrom(scope) {
        let current = this;
        while (current) {
            if (current === scope) {
                return true;
            }
            current = current._parent;
        }
        return false;
    }
    inherit(parent) {
        // Prevent circular inheritance
        const circularCheck = this.checkCircularInheritance(parent);
        if (circularCheck) {
            throw new Error(`Circular inheritance detected: ${[...circularCheck, parent.name].join(' -> ')}`);
        }
        this._parent = parent;
        return this;
    }
    /**
     * Helper method to check circular inheritance
     * Should return a full sequence of inheritance for logging purposes
     *
     * @param scope
     * @returns
     */
    checkCircularInheritance(scope) {
        const inheritanceChain = [];
        let current = this._parent;
        while (current) {
            inheritanceChain.push(current.name);
            if (current === scope) {
                return inheritanceChain;
            }
            current = current._parent;
        }
        return false;
    }
    printInheritanceChain() {
        const chain = [];
        let current = this;
        while (current) {
            chain.push(current.name);
            current = current._parent;
        }
        console.log(chain.join(' -> '));
    }
    has(entity) {
        switch (true) {
            case typeof entity === 'string': {
                const possibleComponent = this.params.components.find(c => c.name === entity);
                if (possibleComponent) {
                    return true;
                }
                const possibleFragment = this.params.fragments.find(f => f.name === entity);
                if (possibleFragment) {
                    return true;
                }
                if (this.params.entities.some(e => e.constructor.name === entity)) {
                    return true;
                }
                if (!!this._parent)
                    return this._parent.has(entity);
                return false;
            }
            case a_utils_1.A_CommonHelper.isInheritedFrom(entity, A_Component_class_1.A_Component): {
                const found = this.params.components.includes(entity);
                if (!found && !!this._parent)
                    return this._parent.has(entity);
                return found;
            }
            case a_utils_1.A_CommonHelper.isInheritedFrom(entity, A_Entity_class_1.A_Entity): {
                const entities = Array.from(this._entities.values());
                const found = entities.find(e => e instanceof entity);
                return !!found;
            }
            case a_utils_1.A_CommonHelper.isInheritedFrom(entity, A_Fragment_class_1.A_Fragment): {
                const found = this._fragments.has(entity);
                if (!found && !!this._parent)
                    return this._parent.has(entity);
                return found;
            }
            default: {
                return false;
            }
        }
    }
    /**
     * Merges two scopes into a new one
     *
     * [!] Notes:
     *  - this method does NOT modify the existing scopes
     *  - parent of the new scope will be the parent of the current scope or the parent of anotherScope (if exists)
     *
     * @param anotherScope
     * @returns
     */
    merge(anotherScope) {
        const merged = new A_Scope({
            name: `${this.name}&${anotherScope.name}`,
            components: Array.from(new Set([
                ...this.params.components,
                ...anotherScope.params.components
            ])),
            fragments: Array.from(new Set([
                ...this.params.fragments,
                ...anotherScope.params.fragments
            ])),
            entities: Array.from(new Set([
                ...this.params.entities,
                ...anotherScope.params.entities
            ])),
        }, {
            parent: this._parent || anotherScope._parent
        });
        return merged;
    }
    // base definition
    resolve(param1, param2) {
        switch (true) {
            case Array.isArray(param1): {
                return param1.map(c => this.resolveOnce(param1, param2));
            }
            case typeof param1 === 'function': {
                return this.resolveOnce(param1, param2);
            }
            case typeof param1 === 'string': {
                return this.resolveByName(param1);
            }
            default: {
                throw new Error('Invalid arguments provided');
            }
        }
    }
    resolveByName(name) {
        // Check components
        const component = this.params.components.find(c => c.name === name);
        if (component)
            return this.resolveComponent(component);
        // Check fragments
        const fragment = this.params.fragments.find(f => f.constructor.name === name);
        if (fragment)
            return this.resolveFragment(fragment.constructor);
        // Check entities
        const entity = this.params.entities.find(e => e.constructor.name === name);
        if (entity)
            return this.resolveEntity(entity.constructor);
        // If not found in current scope, check parent scope
        if (this._parent) {
            return this._parent.resolveByName(name);
        }
        throw new Error(`Component, Fragment, or Entity with name ${name} not found in the scope ${this.name}`);
    }
    resolveOnce(component, instructions) {
        switch (true) {
            case a_utils_1.A_CommonHelper.isInheritedFrom(component, A_Entity_class_1.A_Entity): {
                return this.resolveEntity(component, instructions);
            }
            case a_utils_1.A_CommonHelper.isInheritedFrom(component, A_Fragment_class_1.A_Fragment): {
                return this.resolveFragment(component);
            }
            case a_utils_1.A_CommonHelper.isInheritedFrom(component, A_Scope): {
                return this.resolveScope(component);
            }
            case a_utils_1.A_CommonHelper.isInheritedFrom(component, A_Component_class_1.A_Component): {
                return this.resolveComponent(component);
            }
            default:
                throw new Error(`Injected Component ${component} not found in the scope`);
        }
    }
    resolveEntity(entity, instructions) {
        var _a;
        const query = (instructions === null || instructions === void 0 ? void 0 : instructions.query) || {};
        const count = ((_a = instructions === null || instructions === void 0 ? void 0 : instructions.pagination) === null || _a === void 0 ? void 0 : _a.count) || 1;
        switch (true) {
            case !instructions: {
                const entities = Array.from(this._entities.values());
                const found = entities.find(e => e instanceof entity);
                switch (true) {
                    case !!found:
                        return found;
                    case !found && !!this._parent:
                        return this._parent.resolveEntity(entity, instructions);
                    default:
                        throw new Error(`Fragment ${entity.name} not found in the scope ${this.name}`);
                }
            }
            case !!query.aseid
                && typeof query.aseid === 'string'
                && this._entities.has(query.aseid):
                {
                    return this._entities.get(query.aseid);
                }
            case !!query.aseid
                && query.aseid instanceof a_utils_1.ASEID
                && this._entities.has(query.aseid.toString()):
                {
                    return this._entities.get(query.aseid.toString());
                }
            case !!query.id: {
                // in this case we have to find the entity by the id
                const entities = Array.from(this._entities.values());
                const found = entities.filter(e => e instanceof entity).find(e => {
                    return String(e.id) === String(query.id);
                });
                return found;
            }
            default:
                throw new Error(`Entity ${entity.constructor.name} not found in the scope ${this.name}`);
        }
    }
    resolveFragment(fragment) {
        const fragmentInstancePresented = this.fragments.some(fr => fr instanceof fragment);
        switch (true) {
            case fragmentInstancePresented && this._fragments.has(fragment):
                return this._fragments.get(fragment);
            case fragmentInstancePresented && !this._fragments.has(fragment):
                return this.fragments.find(fr => fr instanceof fragment);
            case !fragmentInstancePresented && !!this._parent:
                return this._parent.resolveFragment(fragment);
            default:
                throw new Error(`Fragment ${fragment.name} not found in the scope ${this.name}`);
        }
    }
    resolveScope(scope) {
        return this;
    }
    resolveComponent(component) {
        //  The idea here that in case when Scope has no exact component we have to resolve it from the _parent
        //  BUT: if it's not presented in _parent  we have to check for inheritance
        //  That means that we should ensure that there's no components that are children of the required component
        switch (true) {
            // In case when the component is available and exists in the scope
            case this.components.includes(component) && this._components.has(component): {
                return this._components.get(component);
            }
            // In case the component available but does NOT exist in the scope
            case this.components.includes(component) && !this._components.has(component): {
                const componentMeta = A_Context_class_1.A_Context.meta(component);
                const argsMeta = componentMeta.get(A_Component_types_1.A_TYPES__ComponentMetaKey.INJECTIONS);
                const resolvedArgs = ((argsMeta === null || argsMeta === void 0 ? void 0 : argsMeta.get('constructor')) || [])
                    .map(arg => {
                    if ('instructions' in arg) {
                        const { target, instructions } = arg;
                        return this.resolve(target, instructions);
                    }
                    return this.resolve(arg.target);
                });
                const newComponent = new component(...resolvedArgs);
                this.register(newComponent);
                return this._components.get(component);
            }
            // In case when there's a component that is inherited from the required component
            case !this.components.includes(component) && this.components.some(el => a_utils_1.A_CommonHelper.isInheritedFrom(el, component)): {
                const found = this.components.find(el => a_utils_1.A_CommonHelper.isInheritedFrom(el, component));
                return this.resolveComponent(found);
            }
            // In case when the component is not available in the scope but the _parent is available
            case !this.components.includes(component) && !!this._parent: {
                return this._parent.resolveComponent(component);
            }
            default:
                throw new Error(`Component ${component.name} not found in the scope ${this.name}`);
        }
    }
    register(param1) {
        console.log(`Registering in scope ${this.name}:`, param1);
        switch (true) {
            case param1 instanceof A_Entity_class_1.A_Entity && !this._entities.has(param1.aseid.toString()): {
                this._entities.set(param1.aseid.toString(), param1);
                A_Context_class_1.A_Context.register(this, param1);
                break;
            }
            case param1 instanceof A_Fragment_class_1.A_Fragment && !this._fragments.has(param1.constructor): {
                const allowedFragment = this.fragments.find(fr => fr instanceof param1.constructor);
                if (!allowedFragment) {
                    this.fragments.push(param1);
                }
                this._fragments.set(param1.constructor, param1);
                A_Context_class_1.A_Context.register(this, param1);
                break;
            }
            case param1 instanceof A_Component_class_1.A_Component: {
                this._components.set(param1.constructor, param1);
                const allowedComponent = this.components.find(c => c === param1.constructor);
                if (!allowedComponent) {
                    this.components.push(param1.constructor);
                }
                A_Context_class_1.A_Context.register(this, param1);
                break;
            }
            default:
                if (param1 instanceof A_Entity_class_1.A_Entity)
                    throw new Error(`Entity with ASEID ${param1.aseid.toString()} is already registered in the scope ${this.name}`);
                else if (param1 instanceof A_Fragment_class_1.A_Fragment)
                    throw new Error(`Fragment ${param1.constructor.name} is already registered in the scope ${this.name}`);
                else
                    throw new Error(`Cannot register ${param1} in the scope ${this.name}`);
        }
    }
    toJSON() {
        return this.fragments.reduce((acc, fragment) => {
            const serialized = fragment.toJSON();
            return Object.assign(Object.assign({}, acc), { [serialized.name]: serialized });
        }, {});
    }
}
exports.A_Scope = A_Scope;
//# sourceMappingURL=A-Scope.class.js.map