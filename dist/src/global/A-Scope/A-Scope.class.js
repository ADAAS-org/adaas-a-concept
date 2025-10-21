"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_Scope = void 0;
const A_Fragment_class_1 = require("../A-Fragment/A-Fragment.class");
const A_Context_class_1 = require("../A-Context/A-Context.class");
const A_Component_class_1 = require("../A-Component/A-Component.class");
const A_Entity_class_1 = require("../A-Entity/A-Entity.class");
const A_TypeGuards_helper_1 = require("../../helpers/A_TypeGuards.helper");
const A_Error_class_1 = require("../A-Error/A_Error.class");
const A_Formatter_helper_1 = require("../../helpers/A_Formatter.helper");
const ASEID_class_1 = require("../ASEID/ASEID.class");
const A_Common_helper_1 = require("../../helpers/A_Common.helper");
const A_Scope_error_1 = require("./A-Scope.error");
const A_Component_constants_1 = require("../A-Component/A-Component.constants");
class A_Scope {
    // ===========================================================================
    // --------------------Readonly Allowed Properties----------------------------
    // ===========================================================================
    /**
     * Returns the name of the scope
     */
    get name() { return this._name; }
    /**
     * Returns a list of Constructors for A-Components that are available in the scope
     */
    get allowedComponents() { return this._allowedComponents; }
    /**
     * Returns a list of Constructors for A-Entities that are available in the scope
     */
    get allowedEntities() { return this._allowedEntities; }
    /**
     * Returns a list of Constructors for A-Fragments that are available in the scope
     */
    get allowedFragments() { return this._allowedFragments; }
    /**
     * Returns a list of Constructors for A-Errors that are available in the scope
     */
    get allowedErrors() { return this._allowedErrors; }
    // ===========================================================================
    // --------------------Readonly Registered Properties--------------------------
    // ===========================================================================
    /**
     * Returns an Array of entities registered in the scope
     *
     * [!] One entity per aseid
     */
    get entities() { return Array.from(this._entities.values()); }
    /**
     * Returns an Array of fragments registered in the scope
     *
     * [!] One fragment per scope
     */
    get fragments() { return Array.from(this._fragments.values()); }
    /**
     * Returns an Array of components registered in the scope
     *
     * [!] One component instance per scope
     */
    get components() { return Array.from(this._components.values()); }
    /**
     * Returns the parent scope of the current scope
     *
     * @param setValue
     * @returns
     */
    get parent() {
        return this._parent;
    }
    constructor(param1, param2) {
        // ===========================================================================
        // --------------------ALLowed Constructors--------------------------------
        // ===========================================================================
        /**
         * A set of allowed components, A set of constructors that are allowed in the scope
         *
         */
        this._allowedComponents = new Set();
        /**
         * A set of allowed errors, A set of constructors that are allowed in the scope
         */
        this._allowedErrors = new Set();
        /**
         * A set of allowed entities, A set of constructors that are allowed in the scope
         */
        this._allowedEntities = new Set();
        /**
         * A set of allowed fragments, A set of constructors that are allowed in the scope
         */
        this._allowedFragments = new Set();
        // ===========================================================================
        // --------------------Internal Storage--------------------------------
        // ===========================================================================
        /**
         * Storage for the components, should be strong as components are unique per scope
         */
        this._components = new Map();
        /**
         * Storage for the errors, should be strong as errors are unique per code
         */
        this._errors = new Map();
        /**
         * Storage for the entities, should be strong as entities are unique per aseid
         */
        this._entities = new Map();
        /**
         * Storage for the fragments, should be weak as fragments are singletons per scope
         */
        this._fragments = new Map();
        const initializer = this.getInitializer(param1);
        // the returned initializer is already bound to `this` (we used .bind(this)),
        // so calling it will run the appropriate logic on this instance:
        initializer.call(this, param1, param2);
    }
    /**
     * Determines which initializer method to use based on the type of the first parameter.
     *
     * @param param1
     * @returns
     */
    getInitializer(param1, param2) {
        switch (true) {
            case !param1 && !param2:
                ;
                return this.defaultInitialized;
            case !!param1:
                return this.defaultInitialized;
            default:
                throw new A_Scope_error_1.A_ScopeError(A_Scope_error_1.A_ScopeError.ConstructorError, 'Invalid parameters provided to A_Scope constructor');
        }
    }
    defaultInitialized(params = {}, config = {}) {
        this._name = params.name || this.constructor.name;
        this.initComponents(params.components);
        this.initErrors(params.errors);
        this.initFragments(params.fragments);
        this.initEntities(params.entities);
        if (config.parent) {
            this._parent = config.parent;
        }
    }
    //==========================================================================
    // --------------------Scope Initialization Methods---------------------------
    //==========================================================================
    /**
     * This method is used to initialize the components in the scope
     * To save memory components are initialized only when they are requested
     *
     * This method only registers the component in the scope in case they are not registered yet
     *
     * @param _components
     */
    initComponents(_components) { _components === null || _components === void 0 ? void 0 : _components.forEach(this.register.bind(this)); }
    /**
     * This method is used to initialize the errors in the scope
     *
     * This method only registers the errors in the scope in case they are not registered yet
     *
     * @param _errors
     */
    initErrors(_errors) { _errors === null || _errors === void 0 ? void 0 : _errors.forEach(this.register.bind(this)); }
    /**
     * This method is used to initialize the entities in the scope
     *
     * This method only registers the entities in the scope in case they are not registered yet
     *
     * @param _entities
     */
    initEntities(_entities) { _entities === null || _entities === void 0 ? void 0 : _entities.forEach(ent => this.register(ent)); }
    /**
     * This method is used to initialize the fragments in the scope
     *
     * This method only registers the fragments in the scope in case they are not registered yet
     *
     * @param _fragments
     */
    initFragments(_fragments) { _fragments === null || _fragments === void 0 ? void 0 : _fragments.forEach(this.register.bind(this)); }
    /**
     * Returns the issuer of the scope, useful for debugging and tracking purposes
     *
     * Issuer can be:
     * - A Container that allocated the scope
     * - A Feature that allocated the scope
     *
     * [!] Note that the issuer is the direct allocator of the scope, so if a Container allocated a Feature that allocated the scope, the issuer will be the Feature
     *
     * @returns
     */
    issuer() {
        return A_Context_class_1.A_Context.issuer(this);
    }
    /**
     * This method is used to inherit from a parent scope
     *
     * [!] This method checks for circular inheritance and throws an error if detected
     *
     * @param parent
     * @returns
     */
    inherit(parent) {
        if (!parent)
            throw new A_Scope_error_1.A_ScopeError(A_Scope_error_1.A_ScopeError.InitializationError, `Invalid parent scope provided`);
        if (parent === this)
            throw new A_Scope_error_1.A_ScopeError(A_Scope_error_1.A_ScopeError.CircularInheritanceError, `Unable to inherit scope ${this.name} from itself`);
        if (parent === this._parent)
            return this;
        // Prevent circular inheritance
        const circularCheck = this.checkCircularInheritance(parent);
        if (circularCheck)
            throw new A_Scope_error_1.A_ScopeError(A_Scope_error_1.A_ScopeError.CircularInheritanceError, `Circular inheritance detected: ${[...circularCheck, parent.name].join(' -> ')}`);
        this._parent = parent;
        return this;
    }
    has(ctor) {
        let found = false;
        switch (true) {
            // 1) Check by string name.  
            case typeof ctor === 'string': {
                // 1.1 Check if it's a component name
                const possibleComponent = Array.from(this.allowedComponents).find(c => c.name === ctor);
                if (possibleComponent)
                    found = true;
                // 1.2 Check if it's a fragment name
                const possibleFragment = Array.from(this.allowedFragments).find(f => f.name === ctor);
                if (possibleFragment)
                    found = true;
                // 1.4 Check if it's an entity name or entity static entity property
                const possibleEntity = Array.from(this.allowedEntities).find(e => e.name === ctor);
                if (possibleEntity)
                    found = true;
                // 1.5 If not found in current scope, check parent scope
                if (!!this._parent)
                    return this._parent.has(ctor);
                return false;
            }
            // 2) Check if it's a Component
            case A_TypeGuards_helper_1.A_TypeGuards.isComponentConstructor(ctor): {
                found = this.isAllowedComponent(ctor);
                break;
            }
            // 3) Check if it's an Entity
            case A_TypeGuards_helper_1.A_TypeGuards.isEntityConstructor(ctor): {
                found = this.isAllowedEntity(ctor);
                break;
            }
            // 4) Check if it's a Fragment
            case A_TypeGuards_helper_1.A_TypeGuards.isFragmentConstructor(ctor): {
                found = this.isAllowedFragment(ctor);
                break;
            }
        }
        if (!found && !!this._parent)
            return this._parent.has(ctor);
        return found;
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
            name: `${this.name} + ${anotherScope.name}`,
            components: [...this.allowedComponents, ...anotherScope.allowedComponents],
            fragments: [...this.fragments, ...anotherScope.fragments],
            entities: [
                ...this.entities, ...anotherScope.entities,
                ...this.allowedEntities, ...anotherScope.allowedEntities
            ],
        }, {
            parent: this._parent || anotherScope._parent
        });
        return merged;
    }
    resolveConstructor(name) {
        // 1) Check components
        const component = Array.from(this.allowedComponents).find(c => c.name === name
            || c.name === A_Formatter_helper_1.A_FormatterHelper.toPascalCase(name));
        if (component)
            return component;
        // 2) Check entities
        const entity = Array.from(this.allowedEntities).find(e => e.name === name
            || e.name === A_Formatter_helper_1.A_FormatterHelper.toPascalCase(name)
            || e.entity === name
            || e.entity === A_Formatter_helper_1.A_FormatterHelper.toKebabCase(name));
        if (entity)
            return entity;
        // 3) Check fragments
        const fragment = Array.from(this.allowedFragments).find(f => f.name === name
            || f.name === A_Formatter_helper_1.A_FormatterHelper.toPascalCase(name));
        if (fragment)
            return fragment;
        // If not found in current scope, check parent scope
        if (!!this._parent) {
            return this._parent.resolveConstructor(name);
        }
        throw new Error(`Component or Entity with name ${name} not found in the scope ${this.name}`);
    }
    resolve(
    /**
     * Provide a component, fragment or entity constructor or an array of constructors to resolve its instance(s) from the scope
     */
    param1, param2) {
        switch (true) {
            case A_TypeGuards_helper_1.A_TypeGuards.isArray(param1): {
                return param1.map(c => {
                    if (A_TypeGuards_helper_1.A_TypeGuards.isString(c))
                        return this.resolveByName(c);
                    else
                        return this.resolveOnce(c, param2);
                }).filter(Boolean);
            }
            case A_TypeGuards_helper_1.A_TypeGuards.isFunction(param1): {
                return this.resolveOnce(param1, param2);
            }
            case A_TypeGuards_helper_1.A_TypeGuards.isString(param1): {
                return this.resolveByName(param1);
            }
            default: {
                throw new A_Error_class_1.A_Error(`Invalid parameter provided to resolve method: ${param1} in scope ${this.name}`);
            }
        }
    }
    // ==================================================================================================
    // --------------------------------------------------------------------------------------------------
    // -------------------------------------INTERNAL RESOLVERS-------------------------------------------
    // --------------------------------------------------------------------------------------------------
    // ==================================================================================================
    /**
     * This method is used internally to resolve a component, fragment or entity by its constructor name
     *
     * [!] Note that this method checks for the component, fragment or entity in the current scope and all parent scopes
     *
     * @param name  - name of the component, fragment or entity to resolve (constructor name for components and fragments, static entity property for entities, static code property for commands)
     * @returns
     */
    resolveByName(
    /**
     * Provide the name of the component, fragment or entity to resolve
     */
    name) {
        // 1) Check components
        const component = Array.from(this.allowedComponents).find(c => c.name === name
            || c.name === A_Formatter_helper_1.A_FormatterHelper.toPascalCase(name));
        if (component)
            return this.resolveOnce(component);
        // 2) Check entities
        const entity = Array.from(this.allowedEntities).find(e => e.name === name
            || e.name === A_Formatter_helper_1.A_FormatterHelper.toPascalCase(name)
            || e.entity === name
            || e.entity === A_Formatter_helper_1.A_FormatterHelper.toKebabCase(name));
        if (entity)
            return this.resolveOnce(entity);
        // 3) Check fragments
        const fragment = Array.from(this.allowedFragments).find(f => f.name === name
            || f.name === A_Formatter_helper_1.A_FormatterHelper.toPascalCase(name));
        if (fragment)
            return this.resolveOnce(fragment);
        // If not found in current scope, check parent scope
        if (!!this._parent) {
            return this._parent.resolveByName(name);
        }
        throw new Error(`Component or Entity with name ${name} not found in the scope ${this.name}`);
    }
    /**
     * This method is used internally to resolve a single component, fragment or entity from the scope
     *
     * @param component
     * @param instructions
     * @returns
     */
    resolveOnce(component, instructions) {
        if (A_TypeGuards_helper_1.A_TypeGuards.isScopeConstructor(component))
            component;
        if (typeof component == 'function' && component.name === 'A_Scope')
            component;
        switch (true) {
            case A_TypeGuards_helper_1.A_TypeGuards.isEntityConstructor(component): {
                return this.resolveEntity(component, instructions);
            }
            case A_TypeGuards_helper_1.A_TypeGuards.isFragmentConstructor(component): {
                return this.resolveFragment(component);
            }
            case A_TypeGuards_helper_1.A_TypeGuards.isScopeConstructor(component): {
                return this.resolveScope(component);
            }
            case A_TypeGuards_helper_1.A_TypeGuards.isComponentConstructor(component): {
                return this.resolveComponent(component);
            }
            default:
                throw new Error(`Injected Component ${component} not found in the scope`);
        }
    }
    /**
     * This method is used internally to resolve a single entity from the scope based on the provided instructions
     *
     * [!] Note that this method can return either a single entity or an array of entities depending on the instructions provided
     *
     * @param entity
     * @param instructions
     * @returns
     */
    resolveEntity(entity, instructions) {
        var _a;
        const query = (instructions === null || instructions === void 0 ? void 0 : instructions.query) || {};
        const count = ((_a = instructions === null || instructions === void 0 ? void 0 : instructions.pagination) === null || _a === void 0 ? void 0 : _a.count) || 1;
        switch (true) {
            /**
             * 1) In case when no instructions provided, return the first found entity of the provided type
             *
             * [!] Note that it returns ONLY ONE entity
             * [!!] In case when no entity found in the current scope, it tries to resolve it from the parent scope (if exists)
             */
            case !instructions: {
                const found = this.entities.find(e => e instanceof entity);
                switch (true) {
                    case !!found:
                        return found;
                    case !found && !!this._parent:
                        return this._parent.resolveEntity(entity, instructions);
                    default:
                        throw new Error(`Entity ${entity.name} not found in the scope ${this.name}`);
                }
            }
            /**
             * 2) In case when aseid is provided in the query, we can directly get the entity from the map
             *
             * [!] Note that it returns ONLY ONE entity
             */
            case !!query.aseid
                && typeof query.aseid === 'string'
                && this._entities.has(query.aseid):
                {
                    return this._entities.get(query.aseid);
                }
            /**
             * 3) In case when aseid is provided as ASEID instance, we can directly get the entity from the map
             *
             * [!] Note that it returns ONLY ONE entity
             */
            case !!query.aseid
                && typeof query.aseid === 'object'
                && query.aseid instanceof ASEID_class_1.ASEID
                && this._entities.has(query.aseid.toString()):
                {
                    return this._entities.get(query.aseid.toString());
                }
            /**
             * 4) In case when id is provided in the query, we have to find the entity by the id
             *
             * [!]  Note that it returns ONLY ONE entity
             */
            case !!query.id: {
                const found = this.entities
                    .filter(e => e instanceof entity)
                    .find(e => String(e.id) === String(query.id));
                return found;
            }
            /**
             * 5) In case when there's a query object, we have to filter the entities by the query
             *
             * [!] Note that it can return either a single entity or an array of entities depending on the count instruction
             * [!!] In case when no entity found in the current scope, it tries to resolve it from the parent scope (if exists)
             */
            default: {
                const found = this.entities
                    .filter(e => e instanceof entity)
                    .filter(e => {
                    return Object
                        .entries(query)
                        .every(([key, value]) => {
                        if (key in e) {
                            return e[key] === value;
                        }
                        return false;
                    });
                });
                if (found.length === 0 && !!this._parent)
                    return this._parent.resolveEntity(entity, instructions);
                if (count === 1)
                    return found[0];
                return found;
            }
        }
    }
    /**
     * This method is used internally to resolve a single fragment from the scope
     *
     * @param fragment
     * @returns
     */
    resolveFragment(fragment) {
        const fragmentInstancePresented = this._fragments.get(fragment);
        switch (true) {
            case fragmentInstancePresented && this._fragments.has(fragment):
                return fragmentInstancePresented;
            case !fragmentInstancePresented && !!this._parent:
                return this._parent.resolveFragment(fragment);
            default:
                throw new Error(`Fragment ${fragment.name} not found in the scope ${this.name}`);
        }
    }
    /**
     *  This method is used internally to resolve a single scope from the current scope
     *
     * @param scope
     * @returns
     */
    resolveScope(scope) {
        return this;
    }
    /**
     * This method is used internally to resolve a single component from the scope
     *
     * @param component
     * @returns
     */
    resolveComponent(component) {
        //  The idea here that in case when Scope has no exact component we have to resolve it from the _parent
        //  BUT: if it's not presented in _parent  we have to check for inheritance
        //  That means that we should ensure that there's no components that are children of the required component
        switch (true) {
            // 1) In case when the component is available and exists in the scope
            case this.allowedComponents.has(component) && this._components.has(component): {
                return this._components.get(component);
            }
            // 2) In case the component available but does NOT exist in the scope
            case this.allowedComponents.has(component) && !this._components.has(component): {
                const componentMeta = A_Context_class_1.A_Context.meta(component);
                const argsMeta = componentMeta.get(A_Component_constants_1.A_TYPES__ComponentMetaKey.INJECTIONS);
                const resolvedArgs = ((argsMeta === null || argsMeta === void 0 ? void 0 : argsMeta.get('constructor')) || [])
                    .map(arg => {
                    if ('instructions' in arg) {
                        const { target, instructions } = arg;
                        return this.resolve(target, instructions);
                    }
                    // TODO: Fix types mismatch here
                    return this.resolve(arg.target);
                });
                const newComponent = new component(...resolvedArgs);
                this.register(newComponent);
                return this._components.get(component);
            }
            // 3) In case when there's a component that is inherited from the required component
            case !this.allowedComponents.has(component) && Array.from(this.allowedComponents).some(el => A_Common_helper_1.A_CommonHelper.isInheritedFrom(el, component)): {
                const found = Array.from(this.allowedComponents).find(el => A_Common_helper_1.A_CommonHelper.isInheritedFrom(el, component));
                return this.resolveComponent(found);
            }
            // 4) In case when the component is not available in the scope but the _parent is available
            case !!this._parent: {
                return this._parent.resolveComponent(component);
            }
            default:
                throw new Error(`Component ${component.name} not found in the scope ${this.name}`);
        }
    }
    register(param1) {
        switch (true) {
            // ------------------------------------------
            // ------------ Instances ----------------
            // ------------------------------------------
            // 1) In case when it's a A-Component instance
            case param1 instanceof A_Component_class_1.A_Component: {
                if (!this.allowedComponents.has(param1.constructor))
                    this.allowedComponents.add(param1.constructor);
                this._components.set(param1.constructor, param1);
                A_Context_class_1.A_Context.register(this, param1);
                break;
            }
            // 3) In case when it's a A-Entity instance
            case param1 instanceof A_Entity_class_1.A_Entity && !this._entities.has(param1.aseid.toString()): {
                if (!this.allowedEntities.has(param1.constructor))
                    this.allowedEntities.add(param1.constructor);
                this._entities.set(param1.aseid.toString(), param1);
                A_Context_class_1.A_Context.register(this, param1);
                break;
            }
            // 4) In case when it's a A-Fragment instance
            case param1 instanceof A_Fragment_class_1.A_Fragment: {
                if (!this.allowedFragments.has(param1.constructor))
                    this.allowedFragments.add(param1.constructor);
                this._fragments.set(param1.constructor, param1);
                A_Context_class_1.A_Context.register(this, param1);
                break;
            }
            // 5) In case when it's a A-Error instance
            case param1 instanceof A_Error_class_1.A_Error: {
                if (!this.allowedErrors.has(param1.constructor))
                    this.allowedErrors.add(param1.constructor);
                // A_Context.register(this, param1);
                break;
            }
            // ------------------------------------------
            // ------------ Constructors ----------------
            // ------------------------------------------
            // 6) In case when it's a A-Component constructor
            case A_TypeGuards_helper_1.A_TypeGuards.isComponentConstructor(param1): {
                if (!this.allowedComponents.has(param1))
                    this.allowedComponents.add(param1);
                break;
            }
            // 8) In case when it's a A-Fragment constructor
            case A_TypeGuards_helper_1.A_TypeGuards.isFragmentConstructor(param1): {
                if (!this.allowedFragments.has(param1))
                    this.allowedFragments.add(param1);
                break;
            }
            // 9) In case when it's a A-Entity constructor
            case A_TypeGuards_helper_1.A_TypeGuards.isEntityConstructor(param1): {
                if (!this.allowedEntities.has(param1))
                    this.allowedEntities.add(param1);
                break;
            }
            // 10) In case when it's a A-Error constructor
            case A_TypeGuards_helper_1.A_TypeGuards.isErrorConstructor(param1): {
                if (!this.allowedErrors.has(param1))
                    this.allowedErrors.add(param1);
                break;
            }
            // ------------------------------------------
            // ------------ Invalid Cases ----------------
            // ------------------------------------------
            default:
                if (param1 instanceof A_Entity_class_1.A_Entity)
                    throw new Error(`Entity with ASEID ${param1.aseid.toString()} is already registered in the scope ${this.name}`);
                else if (param1 instanceof A_Fragment_class_1.A_Fragment)
                    throw new Error(`Fragment ${param1.constructor.name} is already registered in the scope ${this.name}`);
                else
                    throw new Error(`Cannot register ${param1} in the scope ${this.name}`);
        }
    }
    /**
     * This method is useful when you want to serialize the scope to JSON
     *
     * [!] Note this is not a deep serialization, only the fragments are serialized
     * [!] Fragments are a storage for information which is relevant to the scope
     *
     * @returns
     */
    toJSON() {
        return this.fragments
            .reduce((acc, fragment) => {
            const serialized = fragment.toJSON();
            return Object.assign(Object.assign({}, acc), { [serialized.name]: serialized });
        }, {});
    }
    //==========================================================================
    // --------------------Scope Type Check Helpers---------------------------
    //==========================================================================
    /**
     * Type guard to check if the constructor is of type A_Component and is allowed in the scope
     *
     * @param ctor
     * @returns
     */
    isAllowedComponent(ctor) {
        return A_TypeGuards_helper_1.A_TypeGuards.isComponentConstructor(ctor) && this.allowedComponents.has(ctor);
    }
    /**
     * Type guard to check if the constructor is of type A_Entity and is allowed in the scope
     *
     * @param ctor
     * @returns
     */
    isAllowedEntity(ctor) {
        return A_TypeGuards_helper_1.A_TypeGuards.isEntityConstructor(ctor) && this.allowedEntities.has(ctor);
    }
    /**
     * Type guard to check if the constructor is of type A_Fragment and is allowed in the scope
     *
     * @param ctor
     * @returns
     */
    isAllowedFragment(ctor) {
        return A_TypeGuards_helper_1.A_TypeGuards.isFragmentConstructor(ctor) && this.allowedFragments.has(ctor);
    }
    /**
     * Type guard to check if the constructor is of type A_Error and is allowed in the scope
     *
     * @param ctor
     * @returns
     */
    isAllowedError(ctor) {
        return A_TypeGuards_helper_1.A_TypeGuards.isErrorConstructor(ctor) && this.allowedErrors.has(ctor);
    }
    // ==========================================================================
    // --------------------DEBUG & Helpers Methods--------------------------------
    // ===========================================================================
    /**
     * This method is used to check if the scope is inherited from another scope
     *
     * @param scope
     * @returns
     */
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
    /**
     * Helper method to print the inheritance chain of the scope
     */
    printInheritanceChain() {
        const chain = [];
        let current = this;
        while (current) {
            chain.push(current.name);
            current = current._parent;
        }
        console.log(chain.join(' -> '));
    }
}
exports.A_Scope = A_Scope;
//# sourceMappingURL=A-Scope.class.js.map