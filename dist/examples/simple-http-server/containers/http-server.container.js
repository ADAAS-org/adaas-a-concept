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
exports.DefaultHttpServer = void 0;
const A_Container_class_1 = require("../../../src/global/A-Container/A-Container.class");
const http_1 = require("http");
const A_Run_decorator_1 = require("../../../src/decorators/A-ConceptLifecycle/A-Run/A-Run.decorator");
const A_Inject_decorator_1 = require("../../../src/decorators/A-Inject/A-Inject.decorator");
const A_ConceptLifecycle_1 = require("../../../src/decorators/A-ConceptLifecycle");
const A_Config_namespace_1 = require("src/containers/A-Config/A-Config.namespace");
class DefaultHttpServer extends A_Container_class_1.A_Container {
    create(concept, config) {
        return __awaiter(this, void 0, void 0, function* () {
            // Set the server to listen on port 3000
            this.port = config.get('PORT') || 3000;
            // Create the HTTP server
            this.server = (0, http_1.createServer)((req, res) => {
                // Set the response headers
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/plain');
                // Routing logic (basic example)
                if (req.url === '/') {
                    res.end('Welcome to the homepage!');
                }
                else if (req.url === '/about') {
                    res.end('Welcome to the about page!');
                }
                else {
                    res.statusCode = 404;
                    res.end('404 - Page not found');
                }
            });
            this.namespace.registerServer(this.server, this.port);
        });
    }
    run(params) {
        return __awaiter(this, void 0, void 0, function* () {
            this.server.listen(this.port, () => {
                console.log(`Server is running on http://localhost:${this.port}`);
            });
        });
    }
}
exports.DefaultHttpServer = DefaultHttpServer;
__decorate([
    A_ConceptLifecycle_1.A_Lifecycle.Load(),
    __param(1, (0, A_Inject_decorator_1.A_Inject)(A_Config_namespace_1.A_Config))
], DefaultHttpServer.prototype, "create", null);
__decorate([
    (0, A_Run_decorator_1.A_Run)({})
], DefaultHttpServer.prototype, "run", null);
//# sourceMappingURL=http-server.container.js.map