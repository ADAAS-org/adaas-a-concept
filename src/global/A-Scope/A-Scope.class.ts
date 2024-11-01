import { A_CommonHelper } from "@adaas/a-utils";
import { A_TYPES__ScopeConfig, A_TYPES__ScopeConstructor } from "./A-Scope.types";
import { A_Fragment } from "../A-Fragment/A-Fragment.class";
import { A_Context } from "../A-Context/A-Context.class";
import { A_TYPES__ComponentMeta_InjectionParam, A_TYPES__ComponentMetaKey } from "../A-Component/A-Component.types";
import { A_Component } from "../A-Component/A-Component.class";
import { A_Entity } from "../A-Entity/A-Entity.class";

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
export class A_Scope {

    name: string = '';

    private _components: WeakMap<typeof A_Component.constructor, any> = new WeakMap();
    private _fragments: WeakMap<typeof A_Fragment.constructor, any> = new WeakMap();
    private _entities: Map<string, A_Entity> = new Map();

    private parent?: A_Scope;

    protected params!: A_TYPES__ScopeConstructor


    constructor(
        params: Partial<A_TYPES__ScopeConstructor>,
        config: Partial<A_TYPES__ScopeConfig> = {}
    ) {
        this.name = params.name || this.constructor.name;

        // TODO: move to defaults
        const defaultParams: A_TYPES__ScopeConstructor = {
            name: '',
            components: [],
            fragments: [],
            import: [],
            export: [],
        };


        this.params = A_CommonHelper.deepCloneAndMerge<A_TYPES__ScopeConstructor>(params, defaultParams);

        this.initComponents(params.components || []);
        this.initFragments(params.fragments || []);

        if (config.parent) {
            this.parent = config.parent;
        }
    }


    private initComponents(_components: Array<{ new(...args: any[]): any }>) {
        // _components.forEach(component => {
        //     this._components.set(component, new component());
        // })
    }


    private initFragments(_fragments: Array<A_Fragment>) {
        _fragments.forEach(this.register.bind(this));
    }


    get components() {
        return this.params.components || [];
    }



    /**
     * This method is used to check if the component is available in the scope
     * 
     * @param component 
     * @returns 
     */
    has(
        component: { new(...args: any[]): any }
    ): boolean
    has(
        fragment: A_Fragment
    ): boolean
    has(
        entity: { new(...args: any[]): any } | A_Fragment
    ): boolean {

        switch (true) {
            case entity instanceof A_Fragment
                && this._fragments.has(entity.constructor): {
                    return true;
                }

            case entity instanceof A_Fragment
                && !this._fragments.has(entity.constructor)
                && !!this.parent: {
                    return this.parent.has(entity);
                }

            case !(entity instanceof A_Fragment)
                && this._components.has(entity): {
                    return true;
                }

            case !(entity instanceof A_Fragment)
                && !this._components.has(entity)
                && !!this.parent: {
                    return this.parent.has(entity);
                }

            default: {
                return false;
            }
        }
    }


    /**
     * This method is used to get the component by class
     * 
     * @param component 
     * @returns 
     */
    resolve<T extends A_TYPES__ComponentMeta_InjectionParam>(component: T): InstanceType<T>
    resolve<T extends A_TYPES__ComponentMeta_InjectionParam>(component: Array<T>): Array<InstanceType<T>>
    // base definition
    resolve<T extends A_TYPES__ComponentMeta_InjectionParam>(
        param1: Array<T> | T,
        param2?: string
    ): Array<InstanceType<T>> | InstanceType<T> {

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



    private resolveOnce<T extends A_TYPES__ComponentMeta_InjectionParam>(component: T): InstanceType<T> {
        switch (true) {
            case A_CommonHelper.isInheritedFrom(component, A_Fragment): {
                return this.resolveFragment(component as typeof A_Fragment) as InstanceType<T>;
            }

            case A_CommonHelper.isInheritedFrom(component, A_Scope): {
                return this.resolveScope(component as typeof A_Scope) as InstanceType<T>;
            }

            case A_CommonHelper.isInheritedFrom(component, A_Component): {
                return this.resolveComponent(component as typeof A_Component) as InstanceType<T>;
            }

            default:
                throw new Error(`Injected Component ${component} not found in the scope`);
        }
    }



    private resolveFragment<T extends typeof A_Fragment>(fragment: T): InstanceType<T> {

        if (this._fragments.has(fragment)) {
            return this._fragments.get(fragment);
        }

        if (this.parent) {
            return this.parent.resolveFragment(fragment);
        }

        throw new Error(`Fragment ${fragment.name} not found in the scope ${this.name}`);
    }

    private resolveScope<T extends { new(...args: any[]): A_Scope }>(scope: T): InstanceType<T> {

        if (A_CommonHelper.isInheritedFrom(scope, this.constructor)) {
            return this as InstanceType<T>;
        } else if (this.parent) {
            return this.parent.resolveScope(scope);
        }

        throw new Error(`Scope ${scope.name} not found in the scope ${this.name}`);
    }


    private resolveComponent<T extends A_Component>(component: {
        new(...args: any[]): T
    }): T {

        if (this.components.includes(component) && this._components.has(component))
            return this._components.get(component);

        else if (this.components.includes(component) && !this._components.has(component)) {
            const componentMeta = A_Context.meta(component)

            const argsMeta = componentMeta.get(A_TYPES__ComponentMetaKey.INJECTIONS);

            const resolvedArgs = (argsMeta?.get('constructor') || [])
                .map(arg => this.resolve(arg));

            const newComponent = new component(...resolvedArgs)

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



    /**
     * This method is used to register the component in the scope
     * 
     * @param fragment 
     */
    register(fragment: A_Entity): void
    register(fragment: A_Component): void
    register(fragment: A_Fragment): void
    register(
        param1: A_Fragment | A_Component | A_Entity
    ): void {


        switch (true) {
            case param1 instanceof A_Fragment && !this._fragments.has(param1.constructor): {
                this._fragments.set(param1.constructor, param1);
                // The same situation. Have not idea how to fix it
                A_Context.register(this, param1 as any);
                break;
            }

            case param1 instanceof A_Entity && !this._entities.has(param1.aseid.toString()): {
                this._entities.set(param1.aseid.toString(), param1);
                // The same situation. Have not idea how to fix it
                A_Context.register(this, param1 as any);
                break;
            }

            case param1 instanceof A_Component: {
                this._components.set(param1.constructor, param1);
                // The same situation. Have not idea how to fix it
                A_Context.register(this, param1 as any);
                break;
            }

            default:
                throw new Error('Invalid arguments provided');
        }



    }
}