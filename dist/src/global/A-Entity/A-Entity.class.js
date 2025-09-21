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
const a_utils_1 = require("@adaas/a-utils");
const errors_constants_1 = require("@adaas/a-utils/dist/src/constants/errors.constants");
const A_Context_class_1 = require("../A-Context/A-Context.class");
/**
 * A_Entity is another abstraction that describes all major participants in the system business logic.
 * Each Entity should have a clear definition and a clear set of responsibilities.
 * However, entity may hide some of its responsibilities behind the interface to prevent overload.
 *
 * Each entity should be connected to the ContextFragment (Scope) and should be able to communicate with other entities.
 */
class A_Entity {
    /**
     * Entity Identifier that corresponds to the class name
     */
    static get entity() {
        return a_utils_1.A_CommonHelper
            .toUpperSnakeCase(this.name)
            .toLocaleLowerCase()
            .replace(/_/g, '-');
    }
    constructor(props) {
        const initializer = this.getInitializer(props);
        // the returned initializer is already bound to `this` (we used .bind(this)),
        // so calling it will run the appropriate logic on this instance:
        initializer.call(this, props);
    }
    // --- Type guards used to classify `props` properly ---
    isStringASEID(x) {
        return typeof x === "string" && a_utils_1.ASEID.isASEID(x);
    }
    isASEIDInstance(x) {
        return x instanceof a_utils_1.ASEID;
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
    // --- Overloads: provide precise return-type depending on input ---
    getInitializer(props) {
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
        throw new a_utils_1.A_Error(errors_constants_1.A_CONSTANTS__DEFAULT_ERRORS.INCORRECT_A_ENTITY_CONSTRUCTOR);
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
    /**
     * Extracts the namespace from the ASEID
     * namespace is an application specific identifier from where the entity is coming from
     */
    get namespace() {
        return this.aseid.namespace;
    }
    /**
     * Extracts the scope from the ASEID
     * scope is the scope of the entity from Application Namespace
     */
    get scope() {
        return this.aseid.scope;
    }
    /**
     * Extracts the entity from the ASEID
     * entity is the name of the entity from Application Namespace
     *
     */
    get entity() {
        return this.aseid.entity;
    }
    /**
     * Extracts the version from the ASEID
     * version is the version of the entity
     */
    get version() {
        return this.aseid.version;
    }
    /**
     * Extracts the shard from the ASEID
     * shard is the shard of the entity
     */
    get shard() {
        return this.aseid.shard;
    }
    /**
     * Call a feature of the component
     *
     * @param lifecycleMethod
     * @param args
     */
    call(feature_1) {
        return __awaiter(this, arguments, void 0, function* (feature, scope = A_Context_class_1.A_Context.scope(this)) {
            //  scope can be completely custom without relation to the entity scope
            //  or it can be inherited from the entity scope
            // [!Not Now!] however, each feature should create own scope regardless of the passed scope
            //  to avoid any possible side effects
            if (scope && !scope.isInheritedFrom(A_Context_class_1.A_Context.scope(this))) {
                scope = scope.inherit(A_Context_class_1.A_Context.scope(this));
            }
            const newFeature = A_Context_class_1.A_Context.feature(this, feature, scope);
            return yield newFeature.process();
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
    fromASEID(aseid) {
        if (typeof aseid === 'string' && a_utils_1.ASEID.isASEID(aseid)) {
            this.aseid = new a_utils_1.ASEID(aseid);
        }
        else if (aseid instanceof a_utils_1.ASEID) {
            this.aseid = aseid;
        }
        else {
            throw new a_utils_1.A_Error(errors_constants_1.A_CONSTANTS__DEFAULT_ERRORS.INCORRECT_A_ENTITY_CONSTRUCTOR);
        }
    }
    fromNew(newEntity) {
        // this.aseid = new ASEID
        return;
    }
    fromJSON(serialized) {
        this.aseid = new a_utils_1.ASEID((serialized).aseid);
        return;
    }
    /**
     * Converts the entity to a JSON object
     *
     *
     * @returns
     */
    toJSON() {
        return {
            aseid: this.aseid.toString()
        };
    }
    toString() {
        return this.aseid ? this.aseid.toString() : this.constructor.name;
    }
}
exports.A_Entity = A_Entity;
//# sourceMappingURL=A-Entity.class.js.map