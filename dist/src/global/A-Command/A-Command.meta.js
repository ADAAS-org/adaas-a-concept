"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_CommandMeta = void 0;
const A_Meta_class_1 = require("../A-Meta/A-Meta.class");
const A_Command_types_1 = require("./A-Command.types");
class A_CommandMeta extends A_Meta_class_1.A_Meta {
    /**
     * Returns all features defined in the Container
     *
     * @returns
     */
    features() {
        const features = this.get(A_Command_types_1.A_TYPES__CommandMetaKey.FEATURES);
        return (features === null || features === void 0 ? void 0 : features.toArray().map(([, feature]) => feature)) || [];
    }
}
exports.A_CommandMeta = A_CommandMeta;
//# sourceMappingURL=A-Command.meta.js.map