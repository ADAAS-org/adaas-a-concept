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
exports.HttpServer = void 0;
const A_Container_class_1 = require("../../../src/global/A-Container/A-Container.class");
const http_1 = require("http");
const A_Inject_decorator_1 = require("../../../src/decorators/A-Inject/A-Inject.decorator");
// import { A_Feature } from "@adaas/a-concept/decorators/A-Feature/A-Feature.decorator";
const A_Concept_class_1 = require("../../../src/global/A-Concept/A_Concept.class");
const A_Config_context_1 = require("../../../src/base/A-Config/A-Config.context");
const A_Feature_class_1 = require("../../../src/global/A-Feature/A-Feature.class");
const http_request_context_1 = require("../contexts/http-request.context");
class HttpServer extends A_Container_class_1.A_Container {
    create(config) {
        return __awaiter(this, void 0, void 0, function* () {
            // Set the server to listen on port 3000
            this.port = config.get('PORT') || 3000;
            // Create the HTTP server
            this.server = (0, http_1.createServer)(this.onRequest.bind(this));
        });
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            this.server.listen(this.port, () => {
                console.log(`Server is running on http://localhost:${this.port}`);
            });
        });
    }
    onRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.call('onRequest', {
                fragments: [
                    new http_request_context_1.HTTPRequest(req, res)
                ]
            });
        });
    }
    stop() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
exports.HttpServer = HttpServer;
__decorate([
    A_Concept_class_1.A_Concept.Load(),
    __param(0, (0, A_Inject_decorator_1.A_Inject)(A_Config_context_1.A_Config))
], HttpServer.prototype, "create", null);
__decorate([
    A_Concept_class_1.A_Concept.Start()
], HttpServer.prototype, "run", null);
__decorate([
    A_Feature_class_1.A_Feature.Define()
], HttpServer.prototype, "onRequest", null);
__decorate([
    A_Concept_class_1.A_Concept.Stop()
], HttpServer.prototype, "stop", null);
//# sourceMappingURL=http-server.container.js.map