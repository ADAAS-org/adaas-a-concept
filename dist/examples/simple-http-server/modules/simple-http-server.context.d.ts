import { IncomingMessage, Server } from "http";
export declare class SimpleHTTPServerContext {
    server: Server;
    parseBody(req: IncomingMessage): Promise<any>;
}
