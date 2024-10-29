"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpServer = void 0;
const A_Namespace_class_1 = require("@adaas/a-concept/global/A-Namespace/A_Namespace.class");
class HttpServer extends A_Namespace_class_1.A_Namespace {
    get port() {
        const [name, port] = this.name.split(':');
        return parseInt(port);
    }
    registerServer(server, port) {
        this.servers.set(port.toString(), server);
    }
    getServer(port) {
        return this.servers.get(port.toString());
    }
    parseBody(req) {
        return new Promise((resolve, reject) => {
            let body = '';
            req.on('data', chunk => body += chunk.toString());
            req.on('end', () => resolve(JSON.parse(body)));
            req.on('error', reject);
        });
    }
}
exports.HttpServer = HttpServer;
//# sourceMappingURL=http-server.namespace.js.map