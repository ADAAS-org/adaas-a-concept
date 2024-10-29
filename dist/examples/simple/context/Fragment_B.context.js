"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextFragmentB = void 0;
const A_Fragment_class_1 = require("../../../src/global/A-Fragment/A-Fragment.class");
class ContextFragmentB extends A_Fragment_class_1.A_Fragment {
    constructor() {
        super();
        this.variable = 0;
    }
    increment() {
        this.variable++;
        console.log('ContextFragmentB -> Variable incremented to: ', this.variable);
    }
}
exports.ContextFragmentB = ContextFragmentB;
//# sourceMappingURL=Fragment_B.context.js.map