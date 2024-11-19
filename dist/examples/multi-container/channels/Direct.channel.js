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
exports.DirectChannel = void 0;
const A_Channel_class_1 = require("../../../src/global/A-Channel/A-Channel.class");
class DirectChannel extends A_Channel_class_1.A_Channel {
    constructor(container) {
        super({
            id: `direct-channel--${container.name}`
        });
        this.container = container;
        this.instance = container;
    }
    call(prop, params) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.instance[prop]) {
                throw new Error(`Method ${prop} not found in ${this.instance.name}`);
            }
            return yield this.instance[prop](params);
        });
    }
}
exports.DirectChannel = DirectChannel;
//# sourceMappingURL=Direct.channel.js.map