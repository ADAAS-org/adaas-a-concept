"use strict";
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
exports.EntityA = void 0;
const A_Entity_class_1 = require("../../../src/global/A-Entity/A-Entity.class");
class EntityA extends A_Entity_class_1.A_Entity {
    doSomething() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.call('doSomething');
        });
    }
}
exports.EntityA = EntityA;
//# sourceMappingURL=EntityA.entity.js.map