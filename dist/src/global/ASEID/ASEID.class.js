"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ASEID = void 0;
const A_Identity_helper_1 = require("../../helpers/A_Identity.helper");
const A_TypeGuards_helper_1 = require("../../helpers/A_TypeGuards.helper");
const A_Context_class_1 = require("../A-Context/A-Context.class");
const ASEID_error_1 = require("./ASEID.error");
class ASEID {
    /**
     * Tests if the identity string is an ASEID
     *
     * @param identity
     * @returns
     */
    static isASEID(identity) {
        return this.regexp.test(identity);
    }
    constructor(param1) {
        this.verifyInput(param1);
        const initializer = this.getInitializer(param1);
        // the returned initializer is already bound to `this` (we used .bind(this)),
        // so calling it will run the appropriate logic on this instance:
        initializer.call(this, param1);
    }
    /**
     * Getters for ASEID components
     */
    get concept() {
        return this._concept || A_Context_class_1.A_Context.concept;
    }
    /**
     * Get the scope of the ASEID
     */
    get scope() {
        return this._scope || A_Context_class_1.A_Context.root.name;
    }
    /**
     * Get the entity of the ASEID
     */
    get entity() {
        return this._entity;
    }
    /**
     * Get the id of the ASEID
     */
    get id() {
        return this._id;
    }
    /**
     * Get the version of the ASEID (if any)
     */
    get version() {
        return this._version;
    }
    /**
     * Get the shard of the ASEID (if any)
     */
    get shard() {
        return this._shard;
    }
    /**
     * get Internal Initializer based on the type of the parameter provided
     *
     * @param param1
     * @returns
     */
    getInitializer(param1) {
        switch (true) {
            case A_TypeGuards_helper_1.A_TypeGuards.isString(param1):
                return this.fromString;
            case A_TypeGuards_helper_1.A_TypeGuards.isObject(param1):
                return this.fromObject;
            default:
                throw new ASEID_error_1.ASEID_Error(ASEID_error_1.ASEID_Error.ASEIDInitializationError, 'Invalid parameters provided to ASEID constructor');
        }
    }
    /**
     * Initialize ASEID from string
     *
     * @param param1
     */
    fromString(param1) {
        const [concept, body, version] = param1.split('@');
        const [scope, entity, idCandidate] = body.split(':');
        const shard = idCandidate.includes('.') ? idCandidate.split('.')[0] : undefined;
        const id = idCandidate.includes('.') ? idCandidate.split('.')[1] : idCandidate;
        this._concept = concept || A_Context_class_1.A_Context.root.name;
        this._scope = scope || A_Context_class_1.A_Context.root.name;
        this._entity = entity;
        this._id = id;
        this._version = version;
        this._shard = shard;
    }
    /**
     * Initialize ASEID from object
     *
     * @param param1
     */
    fromObject(param1) {
        this._concept = param1.concept
            ? ASEID.isASEID(param1.concept)
                ? new ASEID(param1.concept).id
                : param1.concept
            : A_Context_class_1.A_Context.concept;
        this._scope = param1.scope
            ? A_TypeGuards_helper_1.A_TypeGuards.isNumber(param1.scope)
                ? A_Identity_helper_1.A_IdentityHelper.formatWithLeadingZeros(param1.scope) :
                ASEID.isASEID(param1.scope)
                    ? new ASEID(param1.scope).id
                    : param1.scope
            : A_Context_class_1.A_Context.root.name;
        this._entity = param1.entity;
        this._id = A_TypeGuards_helper_1.A_TypeGuards.isNumber(param1.id)
            ? A_Identity_helper_1.A_IdentityHelper.formatWithLeadingZeros(param1.id)
            : param1.id;
        this._version = param1.version;
        this._shard = param1.shard;
    }
    /**
     * String representation of the ASEID
     *
     * @returns
     */
    toString() {
        return `${this.concept}@${this.scope}:${this.entity}:${this.shard ? (this.shard + '.' + this.id) : this.id}${this.version ? ('@' + this.version) : ''}`;
    }
    /**
     * JSON representation of the ASEID
     *
     * @returns
     */
    toJSON() {
        return {
            concept: this._concept,
            scope: this._scope,
            entity: this._entity,
            id: this._id,
            version: this._version,
            shard: this._shard
        };
    }
    // --------------------------------------------------------------------------
    // ----------------------- PROTECTED HELPERS --------------------------------
    // --------------------------------------------------------------------------
    verifyInput(param1) {
        switch (true) {
            // 1) check for string and validate it as ASEID
            case A_TypeGuards_helper_1.A_TypeGuards.isString(param1) && !ASEID.isASEID(param1):
                throw new ASEID_error_1.ASEID_Error(ASEID_error_1.ASEID_Error.ASEIDValidationError, 'Invalid ASEID format provided');
            // 2) check for object and validate required fields
            case A_TypeGuards_helper_1.A_TypeGuards.isObject(param1) && !param1.id:
                throw new ASEID_error_1.ASEID_Error(ASEID_error_1.ASEID_Error.ASEIDValidationError, 'ASEID id is required');
            // 3) check for object and validate required fields
            case A_TypeGuards_helper_1.A_TypeGuards.isObject(param1) && !param1.entity:
                throw new ASEID_error_1.ASEID_Error(ASEID_error_1.ASEID_Error.ASEIDValidationError, 'ASEID entity is required');
        }
    }
}
exports.ASEID = ASEID;
//==========================================================================
//============================= STATIC METHODS ===========================
//==========================================================================
/**
 * ASEID Regular Expression
 */
ASEID.regexp = new RegExp(`^[a-z|A-Z|0-9|-]+@[a-z|A-Z|0-9|\-]+:[a-z|A-Z|0-9|\-]+:[a-z|A-Z|0-9|\\.|-]+(@v[0-9|\\.]+|@lts)?$`);
//# sourceMappingURL=ASEID.class.js.map