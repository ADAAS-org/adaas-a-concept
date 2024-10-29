import { A_Container } from "../../../src/global/A-Container/A-Container.class";
import { IncomingMessage, Server, ServerResponse } from "http";
import { A_Config } from "../../../src/base/A-Config/A-Config.context";
import { A_Feature } from "../../../src/global/A-Feature/A-Feature.class";
export declare class HttpServer extends A_Container<['start', 'stop', 'onRequest']> {
    server: Server;
    port: number;
    create(config: A_Config<'PORT'>): Promise<void>;
    run(): Promise<void>;
    onRequest(req: IncomingMessage, res: ServerResponse): Promise<A_Feature>;
    stop(): Promise<void>;
}
