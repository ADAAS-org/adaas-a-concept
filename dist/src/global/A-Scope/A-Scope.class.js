"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_Scope = void 0;
const a_utils_1 = require("@adaas/a-utils");
const A_Inject_storage_1 = require("../../storage/A_Inject.storage");
const A_Fragment_class_1 = require("../A-Fragment/A-Fragment.class");
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
    resolveOnce(component) {
        switch (true) {
            case a_utils_1.A_CommonHelper.isInheritedFrom(component, A_Fragment_class_1.A_Fragment): {
                return this.resolveFragment(component);
            }
            case this.components.includes(component) && this._components.has(component): {
                return this._components.get(component);
            }
            case this.components.includes(component) && !this._components.has(component): {
                const argsMeta = A_Inject_storage_1.A_STORAGE__A_Inject_Instructions.get(component);
                let resolvedArgs = [];
                if (argsMeta)
                    resolvedArgs = (argsMeta.get('constructor') || [])
                        .map(arg => this.resolve(arg));
                this._components.set(component, new component());
                return this._components.get(component);
            }
            case !this.components.includes(component) && !!this.parent: {
                return this.parent.resolve(component);
            }
            default:
                throw new Error(`Component ${component.name} not found in the scope`);
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
    register(fragment) {
        this._fragments.set(fragment.constructor, fragment);
    }
}
exports.A_Scope = A_Scope;
//# sourceMappingURL=A-Scope.class.js.map