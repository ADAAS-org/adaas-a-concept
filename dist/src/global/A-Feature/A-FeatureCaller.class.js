"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_FeatureCaller = void 0;
/**
 * This is a common class that uses to return an entity that initiates a feature call
 *
 * It can be used then in @A_Inject(A_FeatureCaller) to get the entity that initiated the feature call
 *
 * [!] the class itself may be retrieved, but may require additional processing inside the feature
 *
 */
class A_FeatureCaller {
    constructor(component) {
        this._component = component;
    }
    /**
     * Resolves the component that initiated the feature call
     *
     * @returns
     */
    resolve() {
        return this._component;
    }
}
exports.A_FeatureCaller = A_FeatureCaller;
//# sourceMappingURL=A-FeatureCaller.class.js.map