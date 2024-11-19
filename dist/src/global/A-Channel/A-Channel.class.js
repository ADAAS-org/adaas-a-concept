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
exports.A_Channel = void 0;
/**
 * A_Channel is an abstraction over any Communication Type from event emitters to message queues, HTTP requests, etc.
 *
 * A_Channel uses to connect Containers between each other. When
 * When One container needs to communicate with another container, it uses A_Channel.
 *
 */
class A_Channel {
    constructor(params) {
        this.id = params.id;
        this.channel = new Proxy({}, {
            get: (target, prop) => {
                return (...args) => __awaiter(this, void 0, void 0, function* () {
                    this.call(prop);
                });
            }
        });
    }
    call(prop, params) {
        return __awaiter(this, void 0, void 0, function* () {
            // do HTTP Call or just inject class or whatever you want
            console.log('Calling method', prop);
            return {};
        });
    }
}
exports.A_Channel = A_Channel;
//# sourceMappingURL=A-Channel.class.js.map