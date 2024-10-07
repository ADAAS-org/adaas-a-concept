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
const A_Concept_class_1 = require("../../src/global/A-Concept/A_Concept.class");
const http_server_container_1 = require("./containers/http-server.container");
const http_server_namespace_1 = require("./contexts/http-server.namespace");
(() => __awaiter(void 0, void 0, void 0, function* () {
    const simpleConcept = new A_Concept_class_1.A_Concept({
        name: 'test-server',
        // import: [
        //     server1,
        //     server2
        // ],
        containers: [
            http_server_container_1.DefaultHttpServer
        ],
        context: [
            new http_server_namespace_1.HttpServer({
                port: 3000
            }),
            new http_server_namespace_1.HttpServer({
                port: 3001
            })
        ],
    });
    yield simpleConcept.run();
}))();
//# sourceMappingURL=concept.js.map