import { A_Namespace } from "../../../src/global/A-Namespace/A_Namespace.class";
import { IncomingMessage, Server } from "http";
import { A_TYPES__HttpServerNamespaceConstructor } from "./http-server.context.types";
export declare class HttpServer extends A_Namespace<A_TYPES__HttpServerNamespaceConstructor> {
    servers: Map<string, Server>;
    get port(): number;
    registerServer(server: Server, port: number): void;
    getServer(port: number): Server<typeof IncomingMessage, typeof import("http").ServerResponse> | undefined;
    parseBody(req: IncomingMessage): Promise<any>;
}
