"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_EntityMeta = void 0;
const A_Meta_class_1 = require("../A-Meta/A-Meta.class");
const A_Entity_types_1 = require("./A-Entity.types");
class A_EntityMeta extends A_Meta_class_1.A_Meta {
    /**
     * Returns all features defined in the Container
     *
     * @returns
     */
    features() {
        const features = this.get(A_Entity_types_1.A_TYPES__EntityMetaKey.FEATURES);
        return (features === null || features === void 0 ? void 0 : features.toArray().map(([, feature]) => feature)) || [];
    }
}
exports.A_EntityMeta = A_EntityMeta;
//# sourceMappingURL=A-Entity.meta.js.map