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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserActions = void 0;
const A_Inject_decorator_1 = require("../../../src/decorators/A-Inject/A-Inject.decorator");
const A_Channel_class_1 = require("../../../src/global/A-Channel/A-Channel.class");
const A_Component_class_1 = require("../../../src/global/A-Component/A-Component.class");
class UserActions extends A_Component_class_1.A_Component {
    getUserDetails(channel) {
        channel.call('');
    }
}
exports.UserActions = UserActions;
__decorate([
    __param(0, (0, A_Inject_decorator_1.A_Inject)(A_Channel_class_1.A_Channel))
], UserActions.prototype, "getUserDetails", null);
//# sourceMappingURL=UserActions.component.js.map