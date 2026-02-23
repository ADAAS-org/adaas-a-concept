import { A_CommonHelper} from "@adaas/a-concept/helpers/A_Common.helper";
import { A_Dependency_Default } from "./A-Dependency-Default.decorator";
import { A_Dependency_Flat } from "./A-Dependency-Flat.decorator";
import { A_Dependency_Load } from "./A-Dependency-Load.decorator";
import { A_Dependency_Parent } from "./A-Dependency-Parent.decorator";
import { A_Dependency_Require } from "./A-Dependency-Require.decorator";
import { A_DependencyError } from "./A-Dependency.error";
import {
    A_TYPES__A_Dependency_EntityInjectionPagination,
    A_TYPES__A_Dependency_EntityInjectionQuery,
    A_TYPES__A_Dependency_Serialized,
    A_TYPES__A_DependencyInjectable,
    A_TYPES__A_DependencyResolutionStrategy
} from "./A-Dependency.types";
import { A_TYPES__Ctor } from "@adaas/a-concept/types";
import { A_Dependency_All } from "./A-Dependency-All.decorator";
import { A_Dependency_Query } from "./A-Dependency-Query.decorator";


export class A_Dependency<
    T extends A_TYPES__A_DependencyInjectable = A_TYPES__A_DependencyInjectable
> {
    /**
     * Allows to indicate which Injected parameter is required
     * 
     * [!] If parameter marked as required is not provided, an error will be thrown
     * 
     * @returns 
     */
    static get Required(): typeof A_Dependency_Require {
        return A_Dependency_Require;
    }
    /**
     * Allows to indicate which dependency should be loaded from a specific path
     * 
     * @returns 
     */
    static get Loaded(): typeof A_Dependency_Load {
        return A_Dependency_Load;
    }
    /**
     * Allows to indicate which dependency default parameters should be used
     * 
     * @returns 
     */
    static get Default(): typeof A_Dependency_Default {
        return A_Dependency_Default;
    }
    /**
     * Allows to indicate which parent dependency should be resolved
     * e.g. from which layer up the parent should be taken
     * 
     * @returns 
     */
    static get Parent(): typeof A_Dependency_Parent {
        return A_Dependency_Parent;
    }

    /**
     * Allows to indicate that the dependency should be resolved in a flat manner
     * Only in the same scope, without going up to parent scopes
     * 
     * @returns 
     */
    static get Flat(): typeof A_Dependency_Flat {
        return A_Dependency_Flat;
    }

    /**
     * Allows to indicate that all instances of the dependency should be resolved
     * 
     * @returns
     */
    static get All(): typeof A_Dependency_All {
        return A_Dependency_All;
    }

    /**
     * Allows to indicate that the dependency should be resolved by specific query parameters
     * e.g. by ASEID, name, type, custom properties, etc.
     * 
     * @returns
     */
    static get Query(): typeof A_Dependency_Query {
        return A_Dependency_Query;
    }

    protected _name: string;
    protected _target?: A_TYPES__Ctor<T>;
    protected _resolutionStrategy!: A_TYPES__A_DependencyResolutionStrategy;

    protected _defaultPagination: A_TYPES__A_DependencyResolutionStrategy['pagination'] = {
        count: 1,
        from: 'start',
    };
    protected _defaultResolutionStrategy: A_TYPES__A_DependencyResolutionStrategy = {
        require: false,
        load: false,
        parent: 0,
        flat: false,
        create: false,
        args: [],
        query: {},
        pagination: this._defaultPagination,
    };

    get flat(): boolean {
        return this._resolutionStrategy.flat;
    }
    get require(): boolean {
        return this._resolutionStrategy.require;
    }
    get load(): boolean {
        return this._resolutionStrategy.load;
    }
    /**
     * Indicates cases when it's necessary to search across all instances
     */
    get all(): boolean {
        return this._resolutionStrategy.pagination.count !== 1 || Object.keys(this._resolutionStrategy.query).length > 0
    }
    get parent(): number {
        return this._resolutionStrategy.parent;
    }
    get create(): any {
        return this._resolutionStrategy.create;
    }
    get args(): any[] {
        return this._resolutionStrategy.args;
    }
    get query(): Partial<A_TYPES__A_Dependency_EntityInjectionQuery<T>> {
        return this._resolutionStrategy.query as Partial<A_TYPES__A_Dependency_EntityInjectionQuery<T>>;
    }
    get pagination(): A_TYPES__A_Dependency_EntityInjectionPagination {
        return this._resolutionStrategy.pagination;
    }




    /**
     * Class instances allows to identify dependencies by name and use them for better type checking
     * 
     * @param name 
     */
    constructor(
        name: string | A_TYPES__Ctor<T>,
        resolutionStrategy?: Partial<Omit<A_TYPES__A_DependencyResolutionStrategy<T>, 'pagination'> & { pagination: Partial<A_TYPES__A_Dependency_EntityInjectionPagination> }>
    ) {
        this._name = typeof name === 'string' ? name : A_CommonHelper.getComponentName(name);

        this._target = typeof name === 'string' ? undefined : name;

        this.resolutionStrategy = resolutionStrategy || {};

        this.initCheck();
    }

    /**
     * Gets the dependency name
     * 
     * Can be identifier, url or any string value
     * 
     * @returns 
     */
    get name(): string {
        return this._name;
    }

    /**
     * Returns the original class of the dependency if provided
     * 
     */
    get target(): A_TYPES__Ctor<T> | undefined {
        return this._target;
    }

    /**
     * Gets the dependency resolution strategy
     */
    get resolutionStrategy(): A_TYPES__A_DependencyResolutionStrategy<T> {
        return this._resolutionStrategy!;
    }

    /**
     * Sets the dependency resolution strategy
     */
    set resolutionStrategy(strategy: Partial<Omit<A_TYPES__A_DependencyResolutionStrategy<T>, 'pagination'> & { pagination: Partial<A_TYPES__A_Dependency_EntityInjectionPagination> }>) {
        this._resolutionStrategy = {
            ...this._defaultResolutionStrategy,
            ...this._resolutionStrategy,
            ...strategy,
            pagination: {
                ...this._defaultPagination,
                ...(this._resolutionStrategy || {}).pagination,
                ...(strategy.pagination || {})
            },
        };
    }


    /**
     * Method for the parameters check and all input data before usage
     * 
     * @returns 
     */
    private initCheck(): this {
        if (!this._resolutionStrategy) {
            throw new A_DependencyError(
                A_DependencyError.ResolutionParametersError,
                `Resolution strategy parameters are not provided for dependency: ${this._name}`
            );
        }

        return this;
    }


    /**
     * Serializes the dependency to a JSON object
     * 
     * @returns 
     */
    toJSON(): A_TYPES__A_Dependency_Serialized<T> {
        return {
            name: this._name,
            all: this.all,
            require: this.require,
            load: this.load,
            parent: this.parent,
            flat: this.flat,
            create: this.create,
            args: this.args,
            query: this.query,
            pagination: this.pagination,
        }
    }
}



