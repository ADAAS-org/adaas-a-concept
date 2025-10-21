"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_Fragment = void 0;
const A_Meta_class_1 = require("../A-Meta/A-Meta.class");
class A_Fragment {
    /**
     * A-Fragment is a singleton, a piece of execution Context that can be shared between the Components/Entities/Commands
     * For every A_Scope can be defined only One A_Fragment of the same type.
     * This class is useful for the design purpose and maintainance of the application
     *
     *
     * [!] Every A_Fragment is a Memory Class that can store data in memory between the steps of the pipeline.
     * [!] So if it necessary to store some information in the Execution Context - use memory of the Fragment
     */
    constructor(params = {}) {
        /**
         * Memory storage for the Fragment instance
         */
        this._meta = new A_Meta_class_1.A_Meta();
        /**
         * Register the Namespace in the global Namespace provider
         */
        this.name = params.name || this.constructor.name;
    }
    /**
     * Returns the Meta object that allows to store data in the Fragment memory
     *
     * @returns
     */
    get memory() {
        return this._meta;
    }
    /**
     * Returns the JSON representation of the Fragment
     *
     * @returns
     */
    toJSON() {
        return Object.assign({ name: this.name }, this.memory.toArray().reduce((acc, [key, value]) => {
            acc[key] = value;
            return acc;
        }, {}));
    }
}
exports.A_Fragment = A_Fragment;
//# sourceMappingURL=A-Fragment.class.js.map