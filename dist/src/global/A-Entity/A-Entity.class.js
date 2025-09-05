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
            .toUpperSnakeCase(this.constructor.name)
            .toLocaleLowerCase()
            .replace(/_/g, '-');
    }
    constructor(props) {
        switch (true) {
            case (typeof props === 'string' && a_utils_1.ASEID.isASEID(props)):
                this.aseid = new a_utils_1.ASEID(props);
                break;
            case (props instanceof a_utils_1.ASEID):
                this.aseid = props;
                break;
            case (!!props && typeof props === 'object' && 'aseid' in props):
                this.fromJSON(props);
                break;
            case (typeof props === 'object'):
                this.fromNew(props);
                break;
            default:
                throw new a_utils_1.A_Error(errors_constants_1.A_CONSTANTS__DEFAULT_ERRORS.INCORRECT_A_ENTITY_CONSTRUCTOR);
        }
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
    call(feature, scope) {
        return __awaiter(this, void 0, void 0, function* () {
            scope = scope ? scope.inherit(A_Context_class_1.A_Context.scope(this)) : A_Context_class_1.A_Context.scope(this);
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
            this.call('load', scope);
        });
    }
    /**
     * The default method that can be called and extended to destroy entity data.
     */
    destroy(scope) {
        return __awaiter(this, void 0, void 0, function* () {
            this.call('destroy', scope);
        });
    }
    /**
     * The default method that can be called and extended to save entity data.
     */
    save(scope) {
        return __awaiter(this, void 0, void 0, function* () {
            this.call('save', scope);
        });
    }
    // ====================================================================
    // ================== Entity Serialization ============================
    // ====================================================================
    fromNew(newEntity) {
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