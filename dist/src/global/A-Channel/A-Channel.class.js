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
    constructor(realClass, args) {
        this.realClass = realClass;
        this.args = args;
        this.proxyInstance = null;
        this.realInstance = null;
    }
    loadInstance() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.realInstance)
                this.realInstance = new this.realClass(...this.args);
            return this.realInstance;
        });
    }
    resolve() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.proxyInstance) {
                const realInstance = yield this.loadInstance();
                this.proxyInstance = new Proxy({}, {
                    get: (target, prop) => {
                        const value = realInstance[prop];
                        // If the property is a method, return a bound function
                        if (typeof value === 'function') {
                            return value.bind(realInstance);
                        }
                        return value;
                    }
                });
            }
            return this.proxyInstance;
        });
    }
}
exports.A_Channel = A_Channel;
//# sourceMappingURL=A-Channel.class.js.map