import { A_Container } from "../../../src/global/A-Container/A-Container.class";
import { HttpServer } from "../contexts/http-server.namespace";
import { A_Concept } from "../../../src/global/A-Concept/A_Concept.class";
import { A_Config } from "src/containers/A-Config/A-Config.namespace";
export declare class HttpServerController extends A_Container<HttpServer> {
    create(concept: A_Concept, config: A_Config<'PORT'>): Promise<void>;
}
