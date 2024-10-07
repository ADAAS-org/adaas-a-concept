import { A_Namespace } from "@adaas/a-concept/global/A-Namespace/A_Namespace.class";
import { IncomingMessage, Server } from "http";
import { A_TYPES__HttpServerNamespaceConstructor } from "./http-server.context.types";


export class HttpServer extends A_Namespace<A_TYPES__HttpServerNamespaceConstructor> {

    servers!: Map<string, Server>




    get port(): number {
        const [name, port] = this.name.split(':');

        return parseInt(port);
    }


    registerServer(server: Server, port: number) {
        this.servers.set(port.toString(), server);
    }

    getServer(port: number) {
        return this.servers.get(port.toString());
    }

    parseBody(req: IncomingMessage): Promise<any> {
        return new Promise((resolve, reject) => {
            let body = '';
            req.on('data', chunk => body += chunk.toString());
            req.on('end', () => resolve(JSON.parse(body)));
            req.on('error', reject);
        });
    }
}