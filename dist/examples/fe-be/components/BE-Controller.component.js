"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BEController = void 0;
const A_Component_class_1 = require("../../../src/global/A-Component/A-Component.class");
const A_Feature_class_1 = require("../../../src/global/A-Feature/A-Feature.class");
class BEController extends A_Component_class_1.A_Component {
    getOrdersCount() {
        return 0;
    }
}
exports.BEController = BEController;
__decorate([
    A_Feature_class_1.A_Feature.Define({
        name: 'getOrdersCount',
        // channel
    })
], BEController.prototype, "getOrdersCount", null);
//# sourceMappingURL=BE-Controller.component.js.map