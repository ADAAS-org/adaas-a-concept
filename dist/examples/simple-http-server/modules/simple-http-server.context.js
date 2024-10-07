"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleHTTPServerContext = void 0;
const A_Namespace_class_1 = require("../../../src/global/A-Namespace/A_Namespace.class");
let SimpleHTTPServerContext = class SimpleHTTPServerContext {
    parseBody(req) {
        return new Promise((resolve, reject) => {
            let body = '';
            req.on('data', chunk => body += chunk.toString());
            req.on('end', () => resolve(JSON.parse(body)));
            req.on('error', reject);
        });
    }
};
exports.SimpleHTTPServerContext = SimpleHTTPServerContext;
exports.SimpleHTTPServerContext = SimpleHTTPServerContext = __decorate([
    (0, A_Namespace_class_1.A_Context)({})
], SimpleHTTPServerContext);
//# sourceMappingURL=simple-http-server.context.js.map