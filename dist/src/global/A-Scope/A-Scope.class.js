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
        this.params = a_utils_1.A_CommonHelper.deepCloneAndMerge(params, defaultParams);
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
    has(entity) {
        switch (true) {
            case entity instanceof A_Fragment_class_1.A_Fragment
                && this._fragments.has(entity.constructor):
                {
                    return true;
                }
            case entity instanceof A_Fragment_class_1.A_Fragment
                && !this._fragments.has(entity.constructor)
                && !!this.parent:
                {
                    return this.parent.has(entity);
                }
            case !(entity instanceof A_Fragment_class_1.A_Fragment)
                && this._components.has(entity):
                {
                    return true;
                }
            case !(entity instanceof A_Fragment_class_1.A_Fragment)
                && !this._components.has(entity)
                && !!this.parent:
                {
                    return this.parent.has(entity);
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
    resolveFragment(fragment) {
        if (this._fragments.has(fragment)) {
            return this._fragments.get(fragment);
        }
        if (this.parent) {
            return this.parent.resolveFragment(fragment);
        }
        throw new Error(`Fragment ${fragment.name} not found in the scope ${this.name}`);
    }
    resolveScope(scope) {
        return this;
    }
    resolveComponent(component) {
        if (this.components.includes(component) && this._components.has(component))
            return this._components.get(component);
        else if (this.components.includes(component) && !this._components.has(component)) {
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
        else if (!this.components.includes(component) && !!this.parent) {
            return this.parent.resolveComponent(component);
        }
        else {
            throw new Error(`Component ${component.name} not found in the scope`);
        }
    }
    register(param1) {
        switch (true) {
            case param1 instanceof A_Fragment_class_1.A_Fragment && !this._fragments.has(param1.constructor): {
                this._fragments.set(param1.constructor, param1);
                // The same situation. Have not idea how to fix it
                A_Context_class_1.A_Context.register(this, param1);
                break;
            }
            case param1 instanceof A_Entity_class_1.A_Entity && !this._entities.has(param1.aseid.toString()): {
                this._entities.set(param1.aseid.toString(), param1);
                // The same situation. Have not idea how to fix it
                A_Context_class_1.A_Context.register(this, param1);
                break;
            }
            case param1 instanceof A_Component_class_1.A_Component: {
                this._components.set(param1.constructor, param1);
                // The same situation. Have not idea how to fix it
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