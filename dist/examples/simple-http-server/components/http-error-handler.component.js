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
exports.HTTPErrorHandler = void 0;
const A_Inject_decorator_1 = require("../../../src/decorators/A-Inject/A-Inject.decorator");
const http_request_context_1 = require("../contexts/http-request.context");
const A_Logger_component_1 = require("../../../src/base/A-Logger/A-Logger.component");
const http_server_container_1 = require("../containers/http-server.container");
const A_Feature_class_1 = require("../../../src/global/A-Feature/A-Feature.class");
const A_Component_class_1 = require("../../../src/global/A-Component/A-Component.class");
let HTTPErrorHandler = class HTTPErrorHandler extends A_Component_class_1.A_Component {
    constructor(logger) {
        super();
        this.logger = logger;
    }
    onErrorPage(request, feature) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.log('HTTP Error Handler -> onErrorPage()');
            yield feature.completed();
            if (request.state !== 'end' && request.request.url === '/error')
                request.end('Error Page');
        });
    }
    onRequest(request) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.log('HTTP Error Handler -> onRequest()');
            if (request.state !== 'end')
                request.end('Error');
        });
    }
};
exports.HTTPErrorHandler = HTTPErrorHandler;
__decorate([
    A_Feature_class_1.A_Feature.Extend({
        name: 'onRequest',
        container: http_server_container_1.HttpServer
    }),
    __param(0, (0, A_Inject_decorator_1.A_Inject)(http_request_context_1.HTTPRequest)),
    __param(1, (0, A_Inject_decorator_1.A_Inject)(A_Feature_class_1.A_Feature))
], HTTPErrorHandler.prototype, "onErrorPage", null);
__decorate([
    A_Feature_class_1.A_Feature.Extend(),
    __param(0, (0, A_Inject_decorator_1.A_Inject)(http_request_context_1.HTTPRequest))
], HTTPErrorHandler.prototype, "onRequest", null);
exports.HTTPErrorHandler = HTTPErrorHandler = __decorate([
    __param(0, (0, A_Inject_decorator_1.A_Inject)(A_Logger_component_1.A_Logger))
], HTTPErrorHandler);
//# sourceMappingURL=http-error-handler.component.js.map