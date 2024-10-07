import { A_Load } from "@adaas/a-concept/decorators/A-ConceptLifecycle/A-Load/A-Load.decorator";
import { A_Container } from "@adaas/a-concept/global/A-Container/A-Container.class";
import { HttpServer } from "../contexts/http-server.namespace";
import { createServer, IncomingMessage, Server, ServerResponse } from "http";
import { A_Inject } from "@adaas/a-concept/decorators/A-Inject/A-Inject.decorator";
import { A_Concept } from "@adaas/a-concept/global/A-Concept/A_Concept.class";
import { A_Config } from "src/containers/A-Config/A-Config.namespace";





export class HttpServerController extends A_Container<HttpServer> {

    @A_Load(
    )
    public async create(
        concept: A_Concept,
        @A_Inject(A_Config) config: A_Config<'PORT'>
    ) {
        
    }

}