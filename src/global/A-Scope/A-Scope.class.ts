import { A_CommonHelper, ASEID } from "@adaas/a-utils";
import { A_TYPES__ScopeConfig, A_TYPES__ScopeConstructor } from "./A-Scope.types";
import { A_Fragment } from "../A-Fragment/A-Fragment.class";
import { A_Context } from "../A-Context/A-Context.class";
import {
    A_TYPES__ComponentMetaKey
} from "../A-Component/A-Component.types";
import { A_Component } from "../A-Component/A-Component.class";
import { A_Entity } from "../A-Entity/A-Entity.class";
import {
    A_TYPES__A_InjectDecorator_EntityInjectionInstructions,
    A_TYPES__A_InjectDecorator_EntityInjectionQuery,
    A_TYPES__A_InjectDecorator_Injectable
} from "@adaas/a-concept/decorators/A-Inject/A-Inject.decorator.types";


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

    readonly name: string = '';

    private _components: WeakMap<typeof A_Component.constructor, any> = new WeakMap();
    private _fragments: WeakMap<typeof A_Fragment.constructor, any> = new WeakMap();
    private _entities: Map<string, A_Entity> = new Map();

    private _parent?: A_Scope;

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
            entities: [],
        };


        this.params = {
            ...defaultParams,
            ...params
        }

        this.initComponents(params.components || []);
        this.initFragments(params.fragments || []);
        this.initEntities(params.entities || []);

        if (config.parent) {
            this._parent = config.parent;
        }
    }


    private initComponents(_components: Array<{ new(...args: any[]): any }>) {
        // _components.forEach(component => {
        //     this._components.set(component, new component());
        // })
    }

    private initEntities(_entities: Array<A_Entity>) {
        _entities.forEach(this.register.bind(this));
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


    parent(setValue: A_Scope): void
    parent(): A_Scope
    parent(
        setValue?: A_Scope
    ): A_Scope | undefined {
        if (setValue) {
            return this.inherit(setValue);
        }

        return this._parent;
    }

    isInheritedFrom(scope: A_Scope): boolean {
        let current: A_Scope | undefined = this;

        while (current) {
            if (current === scope) {
                return true;
            }
            current = current._parent;
        }

        return false;
    }


    inherit(parent: A_Scope): A_Scope {
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
    checkCircularInheritance(scope: A_Scope): Array<string> | false {
        const inheritanceChain: Array<string> = [];
        let current: A_Scope | undefined = this._parent;

        while (current) {
            inheritanceChain.push(current.name);
            if (current === scope) {
                return inheritanceChain;
            }
            current = current._parent;
        }

        return false;
    }


    printInheritanceChain(): void {
        const chain: Array<string> = [];
        let current: A_Scope | undefined = this;

        while (current) {
            chain.push(current.name);
            current = current._parent;
        }

        console.log(chain.join(' -> '));
    }


    /**
     * This method is used to check if the component is available in the scope
     * 
     * @param component 
     * @returns 
     */
    has<T extends A_Component>(
        component: new (...args: any[]) => T
    ): boolean
    has<T extends A_Entity>(
        entity: new (...args: any[]) => T
    ): boolean
    has<T extends A_Fragment>(
        fragment: new (...args: any[]) => T
    ): boolean
    has(
        constructor: string
    ): boolean
    has<T extends A_Fragment | A_Component | A_Entity>(
        entity: T | string | (new (...args: any[]) => T)
    ): boolean {


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

            case typeof entity === 'function'
                && A_CommonHelper.isInheritedFrom(entity, A_Component): {
                    const found = this.params.components.includes(entity as { new(...args: any[]): A_Component });

                    if (!found && !!this._parent) {
                        return this._parent.has(entity as any);
                    }

                    return found;
                }

            case typeof entity === 'function'
                && A_CommonHelper.isInheritedFrom(entity, A_Entity): {
                    const entities = Array.from(this._entities.values());

                    const found = entities.find(e => e instanceof entity);

                    return !!found;
                }

            case typeof entity === 'function'
                && A_CommonHelper.isInheritedFrom(entity, A_Fragment): {
                    const found = this._fragments.has(entity);

                    if (!found && !!this._parent)
                        return this._parent.has(entity as any);

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
    merge(anotherScope: A_Scope): A_Scope {
        const merged = new A_Scope(
            {
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
            },
            {
                parent: this._parent || anotherScope._parent
            }
        );

        return merged;
    }


    /**
     * This method is used to get the component by class
     * 
     * @param component 
     * @returns 
     */
    resolve<T extends A_TYPES__A_InjectDecorator_Injectable>(
        string: string
    ): InstanceType<T>
    resolve<T extends A_TYPES__A_InjectDecorator_Injectable>(
        component: T
    ): InstanceType<T>
    resolve<T extends A_Entity>(
        entity: { new(...args: any[]): T },
        instructions: Partial<A_TYPES__A_InjectDecorator_EntityInjectionInstructions<T>>
    ): T | Array<T>
    resolve<T extends A_TYPES__A_InjectDecorator_Injectable>(
        component: Array<T>
    ): Array<InstanceType<T>>
    // base definition
    resolve<T extends A_TYPES__A_InjectDecorator_Injectable>(
        param1: Array<T> | T | string,
        param2?: string | Partial<A_TYPES__A_InjectDecorator_EntityInjectionInstructions>
    ): Array<InstanceType<T>> | InstanceType<T> {


        switch (true) {
            case Array.isArray(param1): {
                return param1.map(c => this.resolveOnce(param1 as any, param2 as any));
            }

            case typeof param1 === 'function': {
                return this.resolveOnce(param1 as any, param2 as any);
            }

            case typeof param1 === 'string': {
                return this.resolveByName(param1 as any) as InstanceType<T>;
            }

            default: {
                throw new Error('Invalid arguments provided');
            }
        }
    }


    private resolveByName(name: string): A_Entity | A_Fragment | A_Component {
        // Check components
        const component = this.params.components.find(c => c.name === name);
        if (component) return this.resolveComponent(component);

        // Check fragments
        const fragment = this.params.fragments.find(f => f.constructor.name === name);
        if (fragment) return this.resolveFragment(fragment.constructor as any);

        // Check entities
        const entity = this.params.entities.find(e => e.constructor.name === name);
        if (entity) return this.resolveEntity(entity.constructor as any);

        // If not found in current scope, check parent scope
        if (this._parent) {
            return this._parent.resolveByName(name);
        }

        throw new Error(`Component, Fragment, or Entity with name ${name} not found in the scope ${this.name}`);
    }




    private resolveOnce<T extends { new(...args: any[]): A_Entity }>(
        entity: T,
        instructions: Partial<A_TYPES__A_InjectDecorator_EntityInjectionInstructions>
    ): InstanceType<T> | undefined
    private resolveOnce<T extends A_TYPES__A_InjectDecorator_Injectable>(
        component: T
    ): InstanceType<T>
    private resolveOnce<T extends { new(...args: any[]): A_Entity } | A_TYPES__A_InjectDecorator_Injectable>(
        component: T,
        instructions?: Partial<A_TYPES__A_InjectDecorator_EntityInjectionInstructions>
    ): InstanceType<T> {


        switch (true) {
            case A_CommonHelper.isInheritedFrom(component, A_Entity): {
                return this.resolveEntity(component as any, instructions) as InstanceType<T>;
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
        instructions?: Partial<A_TYPES__A_InjectDecorator_EntityInjectionInstructions<InstanceType<T>>>
    ): InstanceType<T> | undefined | InstanceType<T>[] {

        const query = instructions?.query || {} as Partial<A_TYPES__A_InjectDecorator_EntityInjectionQuery<InstanceType<T>>>;
        const count = instructions?.pagination?.count || 1;

        switch (true) {
            case !instructions: {

                const entities = Array.from(this._entities.values());


                const found = entities.find(e => e instanceof entity);

                switch (true) {
                    case !!found:
                        return found as InstanceType<T>;

                    case !found && !!this._parent:
                        return this._parent.resolveEntity(entity, instructions);

                    default:
                        throw new Error(`Entity ${entity.name} not found in the scope ${this.name}`);
                }
            }

            case !!query.aseid
                && typeof query.aseid === 'string'
                && this._entities.has(query.aseid): {
                    return this._entities.get(query.aseid) as InstanceType<T>;
                }

            case !!query.aseid
                && typeof query.aseid === 'object'
                && query.aseid instanceof ASEID
                && this._entities.has(query.aseid.toString()): {
                    return this._entities.get(query.aseid.toString()) as InstanceType<T>;
                }

            case !!query.id: {

                // in this case we have to find the entity by the id
                const entities = Array.from(this._entities.values());

                const found = entities.filter(
                    e => e instanceof entity
                ).find(e => {
                    return String(e.id) === String(query.id)
                });

                return found as InstanceType<T>;
            }

            default: {
                const entities = Array.from(this._entities.values());

                const found = entities.filter(
                    e => e instanceof entity
                ).filter(e => {
                    return Object.entries(query).every(([key, value]) => {
                        if (key in e) {
                            return (e as any)[key] === value;
                        }
                        return false;
                    });
                });

                if (found.length === 0 && !!this._parent)
                    return this._parent.resolveEntity(entity, instructions);

                if (count === 1)
                    return found[0] as InstanceType<T>;

                return found as InstanceType<T>[];
            }

        }
    }



    private resolveFragment<T extends typeof A_Fragment>(fragment: T): InstanceType<T> {

        const fragmentInstancePresented = this.fragments.some(fr => fr instanceof fragment);


        switch (true) {

            case fragmentInstancePresented && this._fragments.has(fragment):
                return this._fragments.get(fragment);

            case fragmentInstancePresented && !this._fragments.has(fragment):
                return this.fragments.find(fr => fr instanceof fragment) as InstanceType<T>;

            case !fragmentInstancePresented && !!this._parent:
                return this._parent.resolveFragment(fragment);

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

                return this.resolveComponent<T>(found as any);
            }

            // In case when the component is not available in the scope but the _parent is available
            case !this.components.includes(component) && !!this._parent: {
                return this._parent.resolveComponent(component);
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
    register<T extends A_Component>(component: new (...args: any[]) => T): void
    register(entity: A_Entity): void
    register(component: A_Component): void
    register(fragment: A_Fragment): void
    register(
        param1: A_Fragment | A_Component | A_Entity | (new (...args: any[]) => A_Component)
    ): void {
        switch (true) {
            case param1 instanceof A_Component && !this._components.has(param1.constructor): {
                this._components.set(param1.constructor, param1);

                const allowedComponent = this.components.find(c => c === param1.constructor);

                if (!allowedComponent) {
                    this.components.push(param1.constructor as any);
                }

                A_Context.register(this, param1);
                break;
            }

            case param1 instanceof A_Entity && !this._entities.has(param1.aseid.toString()): {
                this._entities.set(param1.aseid.toString(), param1);
                A_Context.register(this, param1);
                break;
            }

            case param1 instanceof A_Fragment && !this._fragments.has(param1.constructor): {
                const allowedFragment = this.fragments.find(fr => fr instanceof param1.constructor);

                if (!allowedFragment) {
                    this.fragments.push(param1);
                }

                this._fragments.set(param1.constructor, param1);
                A_Context.register(this, param1);
                break;
            }

            case param1 instanceof A_Component: {
                this._components.set(param1.constructor, param1);

                const allowedComponent = this.components.find(c => c === param1.constructor);

                if (!allowedComponent) {
                    this.components.push(param1.constructor as any);
                }

                A_Context.register(this, param1);
                break;
            }

            case typeof param1 === 'function' && A_CommonHelper.isInheritedFrom(param1, A_Component): {
                const allowedComponent = this.components.find(c => c === param1);

                if (!allowedComponent)
                    this.components.push(param1);
                break;
            }
            default:
                if (param1 instanceof A_Entity)
                    throw new Error(`Entity with ASEID ${param1.aseid.toString()} is already registered in the scope ${this.name}`);
                else if (param1 instanceof A_Fragment)
                    throw new Error(`Fragment ${param1.constructor.name} is already registered in the scope ${this.name}`);
                else
                    throw new Error(`Cannot register ${param1} in the scope ${this.name}`);
        }



    }




    toJSON(): Record<string, any> {
        return this.fragments.reduce((acc, fragment) => {

            const serialized = fragment.toJSON()

            return {
                ...acc,
                [serialized.name]: serialized
            }
        }, {});
    }
}