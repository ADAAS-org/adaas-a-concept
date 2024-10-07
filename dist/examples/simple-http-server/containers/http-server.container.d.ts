import { A_Container } from "../../../src/global/A-Container/A-Container.class";
import { HttpServer } from "../contexts/http-server.namespace";
import { Server } from "http";
import { A_Concept } from "../../../src/global/A-Concept/A_Concept.class";
import { A_TYPES__A_CONCEPT_RootRunParams } from "../../../src/global/A-Concept/A_Concept.types";
import { A_Config } from "src/containers/A-Config/A-Config.namespace";
export declare class DefaultHttpServer extends A_Container<HttpServer> {
    server: Server;
    port: number;
    create(concept: A_Concept, config: A_Config<'PORT'>): Promise<void>;
    run(params: A_TYPES__A_CONCEPT_RootRunParams): Promise<void>;
}
