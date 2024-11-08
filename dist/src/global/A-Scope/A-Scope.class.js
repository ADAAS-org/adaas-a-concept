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
            import: [],
            export: [],
        };
        this.params = Object.assign(Object.assign({}, defaultParams), params);
        this.initComponents(params.components || []);
        this.initFragments(params.fragments || []);
        if (config.parent) {
            this.parent = config.parent;
        }
    }
    initComponents(_components) {
        // _components.forEach(component => {
        //     this._components.set(component, new component());
        // })
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
    has(entity) {
        switch (true) {
            case a_utils_1.A_CommonHelper.isInheritedFrom(entity, A_Component_class_1.A_Component): {
                const found = this.params.components.includes(entity);
                if (!found && !!this.parent)
                    return this.parent.has(entity);
                return found;
            }
            case a_utils_1.A_CommonHelper.isInheritedFrom(entity, A_Entity_class_1.A_Entity): {
                const entities = Array.from(this._entities.values());
                const found = entities.find(e => e instanceof entity);
                return !!found;
            }
            case a_utils_1.A_CommonHelper.isInheritedFrom(entity, A_Fragment_class_1.A_Fragment): {
                const found = this._fragments.has(entity);
                if (!found && !!this.parent)
                    return this.parent.has(entity);
                return found;
            }
            default: {
                return false;
            }
        }
    }
    // base definition
    resolve(param1, param2) {
        switch (true) {
            case Array.isArray(param1): {
                return param1.map(c => this.resolveOnce(c));
            }
            case typeof param1 === 'function': {
                return this.resolveOnce(param1);
            }
            default: {
                throw new Error('Invalid arguments provided');
            }
        }
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
        switch (true) {
            case !instructions: {
                const entities = Array.from(this._entities.values());
                const found = entities.find(e => e instanceof entity);
                switch (true) {
                    case !!found:
                        return found;
                    case !found && !!this.parent:
                        return this.parent.resolveFragment(entity);
                    default:
                        throw new Error(`Fragment ${entity.name} not found in the scope ${this.name}`);
                }
            }
            case !!instructions && !!instructions.aseid && this._entities.has(instructions.aseid): {
                return this._entities.get(instructions.aseid);
            }
            case !!instructions && !!instructions.id && this._entities.has(instructions.id): {
                // in this case we have to find the entity by the id
                const entities = Array.from(this._entities.values());
                const found = entities.find(e => e.id === instructions.id);
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
            case !fragmentInstancePresented && !!this.parent:
                return this.parent.resolveFragment(fragment);
            default:
                throw new Error(`Fragment ${fragment.name} not found in the scope ${this.name}`);
        }
    }
    resolveScope(scope) {
        return this;
    }
    resolveComponent(component) {
        //  The idea here that in case when Scope has no exact component we have to resolve it from the parent
        //  BUT: if it's not presented in parent  we have to check for inheritance
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
            // In case when the component is not available in the scope but the parent is available
            case !this.components.includes(component) && !!this.parent: {
                return this.parent.resolveComponent(component);
            }
            default:
                throw new Error(`Component ${component.name} not found in the scope ${this.name}`);
        }
    }
    register(param1) {
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
                throw new Error('Invalid arguments provided');
        }
    }
}
exports.A_Scope = A_Scope;
//# sourceMappingURL=A-Scope.class.js.map