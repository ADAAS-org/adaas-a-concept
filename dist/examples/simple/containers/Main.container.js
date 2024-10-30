"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
exports.MainContainer = void 0;
const A_Container_class_1 = require("../../../src/global/A-Container/A-Container.class");
const A_Feature_class_1 = require("../../../src/global/A-Feature/A-Feature.class");
const Fragment_A_context_1 = require("../context/Fragment_A.context");
const Fragment_B_context_1 = require("../context/Fragment_B.context");
const A_Concept_class_1 = require("../../../src/global/A-Concept/A_Concept.class");
const A_Inject_decorator_1 = require("../../../src/decorators/A-Inject/A-Inject.decorator");
class MainContainer extends A_Container_class_1.A_Container {
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Main container loaded');
        });
    }
    start(params) {
        return __awaiter(this, void 0, void 0, function* () {
            if (params) {
                console.log('Start');
            }
        });
    }
    method_A() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Method A');
            const feature = this.call('method_A', {
                fragments: [new Fragment_A_context_1.ContextFragmentA(), new Fragment_B_context_1.ContextFragmentB()]
            });
            yield feature.process();
        });
    }
    method_B() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Method B');
            return this.call('method_B');
        });
    }
}
exports.MainContainer = MainContainer;
__decorate([
    A_Concept_class_1.A_Concept.Load()
], MainContainer.prototype, "load", null);
__decorate([
    A_Concept_class_1.A_Concept.Start(),
    __param(0, (0, A_Inject_decorator_1.A_Inject)(MainContainer))
], MainContainer.prototype, "start", null);
__decorate([
    A_Feature_class_1.A_Feature.Define()
], MainContainer.prototype, "method_A", null);
__decorate([
    A_Feature_class_1.A_Feature.Define()
], MainContainer.prototype, "method_B", null);
//# sourceMappingURL=Main.container.js.map