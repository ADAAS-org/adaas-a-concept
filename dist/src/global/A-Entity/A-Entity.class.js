"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_Entity = void 0;
const A_Context_class_1 = require("../A-Context/A-Context.class");
const A_Formatter_helper_1 = require("../../helpers/A_Formatter.helper");
const ASEID_class_1 = require("../ASEID/ASEID.class");
const A_Identity_helper_1 = require("../../helpers/A_Identity.helper");
const A_Entity_error_1 = require("./A-Entity.error");
const A_Feature_class_1 = require("../A-Feature/A-Feature.class");
/**
 * A_Entity is another abstraction that describes all major participants in the system business logic.
 * Each Entity should have a clear definition and a clear set of responsibilities.
 * However, entity may hide some of its responsibilities behind the interface to prevent overload.
 *
 * Each entity should be connected to the ContextFragment (Scope) and should be able to communicate with other entities.
 */
class A_Entity {
    // ====================================================================
    // ================== Static A-Entity Information ============================
    // ====================================================================
    /**
     * Entity Identifier that corresponds to the class name
     */
    static get entity() {
        return A_Formatter_helper_1.A_FormatterHelper.toKebabCase(this.name);
    }
    /**
     * DEFAULT Concept Name (Application Name) of the entity from environment variable A_CONCEPT_NAME
     * [!] If environment variable is not set, it will default to 'a-concept'
     */
    static get concept() {
        return A_Context_class_1.A_Context.concept;
    }
    /**
     * DEFAULT Scope of the entity from environment variable A_CONCEPT_DEFAULT_SCOPE
     * [!] If environment variable is not set, it will default to 'core'
     * [!] Scope is an application specific identifier that can be used to group entities together
     * [!] e.g. 'default', 'core', 'public', 'internal', etc
     */
    static get scope() {
        return A_Context_class_1.A_Context.root.name;
    }
    constructor(props) {
        const initializer = this.getInitializer(props);
        // the returned initializer is already bound to `this` (we used .bind(this)),
        // so calling it will run the appropriate logic on this instance:
        initializer.call(this, props);
    }
    // ====================================================================
    // ================== DUPLICATED ASEID Getters ========================
    // ====================================================================
    /**
     * Extracts the ID from the ASEID
     * ID is the unique identifier of the entity
     */
    get id() {
        return this.aseid.id;
    }
    // ====================================================================
    // ================== Constructor Helpers =============================
    // ====================================================================
    // --- Type guards used to classify `props` properly ---
    isStringASEID(x) {
        return typeof x === "string" && ASEID_class_1.ASEID.isASEID(x);
    }
    isASEIDInstance(x) {
        return x instanceof ASEID_class_1.ASEID;
    }
    /**
     * A "serialized" object is considered such if it is a non-null object
     * and contains an "aseid" property (this mirrors your original check).
     *
     * @param x
     * @returns
     */
    isSerializedObject(x) {
        return !!x && typeof x === "object" && "aseid" in x;
    }
    /**
     * Constructor-style props = a plain object which does NOT contain "aseid".
     * This is the "create from provided fields" case.
     *
     * @param x
     * @returns
     */
    isConstructorProps(x) {
        return !!x && typeof x === "object" && !("aseid" in x);
    }
    /**
     * Determines the appropriate initializer method based on the type of `props`.
     * The method checks if `props` is:
     * 1) a string that matches ASEID format -> fromASEID
     * 2) an ASEID instance -> fromASEID
     * 3) a serialized object (has 'aseid') -> fromJSON
     * 4) a plain object with no 'aseid' -> treat as constructor props -> fromNew
     *
     * [!] If `props` is undefined, it will call fromUndefined method
     *
     * If none of the above, it throws an error indicating incorrect constructor usage.
     *
     *
     * To get a custom initializer, override this method in the child class.
     * Example:
     * ```typescript
     * protected getInitializer(
     *   props?: string | ASEID | _SerializedType | _ConstructorType
     * ): (props: any) => void | (() => void) {
     *   if('customField' in props) {
     *       return this.fromCustomField.bind(this);
     *   }
     *   return super.getInitializer(props);
     * }
     * ```
     * @param props
     * @returns The appropriate initializer method
     */
    getInitializer(props) {
        if (!props) {
            return this.fromUndefined;
        }
        // 1) string that matches ASEID format -> fromASEID
        if (this.isStringASEID(props)) {
            return this.fromASEID;
        }
        // 2) ASEID instance -> fromASEID
        if (this.isASEIDInstance(props)) {
            return this.fromASEID;
        }
        // 3) serialized object (has 'aseid') -> fromJSON
        if (this.isSerializedObject(props)) {
            return this.fromJSON;
        }
        // 4) plain object with no 'aseid' -> treat as constructor props -> fromNew
        if (this.isConstructorProps(props)) {
            return this.fromNew;
        }
        // none of the above -> throw consistent error
        throw new A_Entity_error_1.A_Entity_Error(A_Entity_error_1.A_Entity_Error.ValidationError, 'Unable to determine A-Entity constructor initialization method. Please check the provided parameters.');
    }
    /**
     * Call a feature of the component with the provided scope
     *
     * [!] If the provided scope is not inherited from the entity scope, it will be inherited
     *
     * @param lifecycleMethod
     * @param args
     */
    call(feature, scope) {
        return __awaiter(this, void 0, void 0, function* () {
            const newFeature = new A_Feature_class_1.A_Feature({
                name: feature,
                component: this,
                scope
            });
            return yield newFeature.process(scope);
        });
    }
    // ====================================================================
    // ================== Entity Base Methods =============================
    // ====================================================================
    /**
     * The default method that can be called and extended to load entity data.
     */
    load(scope) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.call('load', scope);
        });
    }
    /**
     * The default method that can be called and extended to destroy entity data.
     */
    destroy(scope) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.call('destroy', scope);
        });
    }
    /**
     * The default method that can be called and extended to save entity data.
     */
    save(scope) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.call('save', scope);
        });
    }
    // ====================================================================
    // ================== Entity Serialization ============================
    // ====================================================================
    /**
     * Create a new entity from ASEID string or instance
     * [!] Executed when the constructor is called with a string or ASEID instance that represents the ASEID
     * [!] Executes By Default with new A_Entity('aseid-string') or new A_Entity(new ASEID(...)) if getInitializer has not been overridden
     *
     * @param aseid
     */
    fromASEID(aseid) {
        if (aseid instanceof ASEID_class_1.ASEID)
            this.aseid = aseid;
        else
            this.aseid = new ASEID_class_1.ASEID(aseid);
    }
    /**
     * Handles the case when no props are provided to the constructor.
     * This method can be overridden in child classes to set default values or perform specific initialization logic.
     * By default, it does nothing.
     *
     *
     * @returns
     */
    fromUndefined() {
        this.aseid = new ASEID_class_1.ASEID({
            concept: this.constructor.concept,
            scope: this.constructor.scope,
            entity: this.constructor.entity,
            id: A_Identity_helper_1.A_IdentityHelper.generateTimeId()
        });
        return;
    }
    /**
     * Create a new entity from constructor object
     * [!] Executed when the constructor is called with an object that does not contain "aseid" property
     * [!] Executes By Default with new A_Entity({}) if getInitializer has not been overridden
     *
     * @param newEntity
     * @returns
     */
    fromNew(newEntity) {
        this.aseid = new ASEID_class_1.ASEID({
            concept: this.constructor.concept,
            scope: this.constructor.scope,
            entity: this.constructor.entity,
            id: A_Identity_helper_1.A_IdentityHelper.generateTimeId()
        });
        return;
    }
    /**
     * Creates a new entity from serialized object
     *
     * [!] Executed when the constructor is called with an object that contains "aseid" property
     * [!] Executes By Default with new A_Entity({ aseid: '...' }) if getInitializer has not been overridden
     *
     *
     * @param serialized
     * @returns
     */
    fromJSON(serialized) {
        this.aseid = new ASEID_class_1.ASEID(serialized.aseid);
        return;
    }
    /**
     * Converts the entity to a JSON object
     * [!] This method should be extended in the child classes to include all properties of the entity
     * [!] Includes aseid by default
     *
     *
     * @returns
     */
    toJSON() {
        return {
            aseid: this.aseid.toString()
        };
    }
    /**
     * Returns the string representation of the entity
     * what is basically the ASEID string
     *
     * @returns
     */
    toString() {
        return this.aseid ? this.aseid.toString() : this.constructor.name;
    }
}
exports.A_Entity = A_Entity;
//# sourceMappingURL=A-Entity.class.js.map