import { A_CommonHelper } from "@adaas/a-utils";
import { A_TYPES__ScopeConfig, A_TYPES__ScopeConstructor } from "./A-Scope.types";
import { A_Fragment } from "../A-Fragment/A-Fragment.class";
import { A_Context } from "../A-Context/A-Context.class";
import {
    A_TYPES__ComponentMeta_EntityInjectionInstructions,
    A_TYPES__ComponentMeta_InjectionParam,
    A_TYPES__ComponentMetaKey
} from "../A-Component/A-Component.types";
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


        this.params = {
            ...defaultParams,
            ...params
        }

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

    get fragments() {
        return this.params.fragments || [];
    }



    /**
     * This method is used to check if the component is available in the scope
     * 
     * @param component 
     * @returns 
     */
    has(
        component: typeof A_Component
    ): boolean
    has(
        entity: typeof A_Entity
    ): boolean
    has(
        fragment: typeof A_Fragment
    ): boolean
    has(
        entity: typeof A_Fragment | typeof A_Component | typeof A_Entity
    ): boolean {


        switch (true) {

            case A_CommonHelper.isInheritedFrom(entity, A_Component): {
                const found = this.params.components.includes(entity);

                if (!found && !!this.parent)
                    return this.parent.has(entity as any);

                return found;
            }

            case A_CommonHelper.isInheritedFrom(entity, A_Entity): {
                const entities = Array.from(this._entities.values());

                const found = entities.find(e => e instanceof entity);

                return !!found;
            }

            case A_CommonHelper.isInheritedFrom(entity, A_Fragment): {
                const found = this._fragments.has(entity);

                if (!found && !!this.parent)
                    return this.parent.has(entity as any);

                return found;
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
    resolve<T extends A_TYPES__ComponentMeta_InjectionParam>(
        component: T
    ): InstanceType<T>
    resolve<T extends { new(...args: any[]): A_Entity }>(
        entity: T,
        instructions: Partial<A_TYPES__ComponentMeta_EntityInjectionInstructions>
    ): InstanceType<T>
    resolve<T extends A_TYPES__ComponentMeta_InjectionParam>(
        component: Array<T>
    ): Array<InstanceType<T>>
    // base definition
    resolve<T extends A_TYPES__ComponentMeta_InjectionParam>(
        param1: Array<T> | T,
        param2?: string | Partial<A_TYPES__ComponentMeta_EntityInjectionInstructions>
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



    private resolveOnce<T extends { new(...args: any[]): A_Entity }>(
        entity: T,
        instructions: Partial<A_TYPES__ComponentMeta_EntityInjectionInstructions>
    ): InstanceType<T> | undefined
    private resolveOnce<T extends A_TYPES__ComponentMeta_InjectionParam>(
        component: T
    ): InstanceType<T>
    private resolveOnce<T extends { new(...args: any[]): A_Entity } | A_TYPES__ComponentMeta_InjectionParam>(
        component: T,
        instructions?: Partial<A_TYPES__ComponentMeta_EntityInjectionInstructions>
    ): InstanceType<T> {
        switch (true) {
            case A_CommonHelper.isInheritedFrom(component, A_Entity): {
                return this.resolveEntity(component as typeof A_Entity, instructions) as InstanceType<T>;
            }

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


    private resolveEntity<T extends { new(...args: any[]): A_Entity }>(
        entity: T,
        instructions?: Partial<A_TYPES__ComponentMeta_EntityInjectionInstructions>
    ): InstanceType<T> | undefined {

        switch (true) {
            case !instructions: {

                const entities = Array.from(this._entities.values());

                const found = entities.find(e => e instanceof entity);

                switch (true) {
                    case !!found:
                        return found as InstanceType<T>;

                    case !found && !!this.parent:
                        return this.parent.resolveFragment(entity);

                    default:
                        throw new Error(`Fragment ${entity.name} not found in the scope ${this.name}`);
                }
            }

            case !!instructions && !!instructions.aseid && this._entities.has(instructions.aseid): {
                return this._entities.get(instructions.aseid) as InstanceType<T>;
            }

            case !!instructions && !!instructions.id && this._entities.has(instructions.id): {
                // in this case we have to find the entity by the id
                const entities = Array.from(this._entities.values());

                const found = entities.find(e => e.id === instructions.id);

                return found as InstanceType<T>;
            }

            default:
                throw new Error(`Entity ${entity.constructor.name} not found in the scope ${this.name}`);
        }
    }



    private resolveFragment<T extends typeof A_Fragment>(fragment: T): InstanceType<T> {

        const fragmentInstancePresented = this.fragments.some(fr => fr instanceof fragment);

        switch (true) {

            case fragmentInstancePresented && this._fragments.has(fragment):
                return this._fragments.get(fragment);

            case fragmentInstancePresented && !this._fragments.has(fragment):
                return this.fragments.find(fr => fr instanceof fragment) as InstanceType<T>;

            case !fragmentInstancePresented && !!this.parent:
                return this.parent.resolveFragment(fragment);

            default:
                throw new Error(`Fragment ${fragment.name} not found in the scope ${this.name}`);
        }
    }


    private resolveScope(scope: typeof A_Scope): A_Scope {
        return this;
    }


    private resolveComponent<T extends A_Component>(component: {
        new(...args: any[]): T
    }): T {

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
                const componentMeta = A_Context.meta(component)

                const argsMeta = componentMeta.get(A_TYPES__ComponentMetaKey.INJECTIONS);

                const resolvedArgs = (argsMeta?.get('constructor') || [])
                    .map(arg => {
                        if ('instructions' in arg) {
                            const { target, instructions } = arg
                            return this.resolve(
                                target,
                                instructions
                            );
                        }
                        return this.resolve(arg.target)
                    });

                const newComponent = new component(...resolvedArgs)

                this.register(newComponent);

                return this._components.get(component);
            }

            // In case when there's a component that is inherited from the required component
            case !this.components.includes(component) && this.components.some(el => A_CommonHelper.isInheritedFrom(el, component)): {

                const found = this.components.find(el => A_CommonHelper.isInheritedFrom(el, component));

                return this.resolveComponent(found!);
            }

            // In case when the component is not available in the scope but the parent is available
            case !this.components.includes(component) && !!this.parent: {
                return this.parent.resolveComponent(component);
            }

            default:
                throw new Error(`Component ${component.name} not found in the scope ${this.name}`);
        }
    }



    /**
     * This method is used to register the component in the scope
     * 
     * @param fragment 
     */
    register(entity: A_Entity): void
    register(component: A_Component): void
    register(fragment: A_Fragment): void
    register(
        param1: A_Fragment | A_Component | A_Entity
    ): void {


        switch (true) {
            case param1 instanceof A_Entity && !this._entities.has(param1.aseid.toString()): {
                this._entities.set(param1.aseid.toString(), param1);
                A_Context.register(this, param1);
                break;
            }

            case param1 instanceof A_Fragment && !this._fragments.has(param1.constructor): {
                this._fragments.set(param1.constructor, param1);
                A_Context.register(this, param1);
                break;
            }

            case param1 instanceof A_Component: {
                this._components.set(param1.constructor, param1);
                A_Context.register(this, param1);
                break;
            }

            default:
                throw new Error('Invalid arguments provided');
        }



    }
}