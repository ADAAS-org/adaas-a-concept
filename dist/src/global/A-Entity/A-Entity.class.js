"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_Entity = void 0;
const a_utils_1 = require("@adaas/a-utils");
const errors_constants_1 = require("@adaas/a-utils/dist/src/constants/errors.constants");
const A_Fragment_class_1 = require("../A-Fragment/A-Fragment.class");
/**
 * A_Entity is another abstraction that describes all major participants in the system business logic.
 * Each Entity should have a clear definition and a clear set of responsibilities.
 * However, entity may hide some of its responsibilities behind the interface to prevent overload.
 *
 * Each entity should be connected to the ContextFragment (Scope) and should be able to communicate with other entities.
 */
class A_Entity extends A_Fragment_class_1.A_Fragment {
    constructor(props) {
        super();
        switch (true) {
            case (typeof props === 'string' && a_utils_1.ASEID.isASEID(props)):
                this.aseid = new a_utils_1.ASEID(props);
                break;
            case (props instanceof a_utils_1.ASEID):
                this.aseid = props;
                break;
            case (typeof props === 'object' && props.aseid):
                this.fromSerialized(props);
                break;
            case (typeof props === 'object'):
                this.fromNewEntity(props);
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
    fromNewEntity(newEntity) {
        return;
    }
    fromSerialized(serialized) {
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
        return this.aseid.toString();
    }
}
exports.A_Entity = A_Entity;
//# sourceMappingURL=A-Entity.class.js.map