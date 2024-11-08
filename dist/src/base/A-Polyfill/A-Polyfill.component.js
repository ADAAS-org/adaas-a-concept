"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
exports.A_Polyfill = void 0;
const A_Component_class_1 = require("../../global/A-Component/A-Component.class");
const A_Concept_class_1 = require("../../global/A-Concept/A_Concept.class");
const a_utils_1 = require("@adaas/a-utils");
class A_Polyfill extends A_Component_class_1.A_Component {
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            const fs = yield a_utils_1.A_Polyfills.fs();
            this.fs = fs;
        });
    }
}
exports.A_Polyfill = A_Polyfill;
__decorate([
    A_Concept_class_1.A_Concept.Load()
], A_Polyfill.prototype, "load", null);
//# sourceMappingURL=A-Polyfill.component.js.map