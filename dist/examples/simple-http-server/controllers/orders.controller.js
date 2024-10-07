"use strict";
// declare module "../modules/simple-http-server.types" {
//     interface SimpleHTTPServerModuleControllers {
//         Orders: OrderController
//     }
// }
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
exports.OrderController = void 0;
const A_Component_class_1 = require("../../../src/global/A-Component/A-Component.class");
class OrderController extends A_Component_class_1.A_Component {
    makeSome1() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Making some request');
        });
    }
    makeSome2() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Making some request');
        });
    }
}
exports.OrderController = OrderController;
//# sourceMappingURL=orders.controller.js.map