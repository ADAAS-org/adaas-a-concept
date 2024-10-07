import { A_Container } from "../../../src/global/A-Container/A-Container.class";
import { HttpServer } from "../contexts/http-server.namespace";
import { A_Config } from "src/containers/A-Config/A-Config.namespace";
export declare class HttpServerRouter extends A_Container<HttpServer> {
    listen(config: A_Config<'PORT'>): Promise<void>;
}
