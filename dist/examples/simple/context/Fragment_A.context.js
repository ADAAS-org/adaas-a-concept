"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextFragmentA = void 0;
const A_Fragment_class_1 = require("../../../src/global/A-Fragment/A-Fragment.class");
class ContextFragmentA extends A_Fragment_class_1.A_Fragment {
    constructor() {
        super();
        this.variable = 0;
    }
    decrement() {
        this.variable--;
        console.log('ContextFragmentA -> Variable decremented to: ', this.variable);
    }
}
exports.ContextFragmentA = ContextFragmentA;
//# sourceMappingURL=Fragment_A.context.js.map