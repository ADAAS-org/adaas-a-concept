import { A_Container } from "@adaas/a-concept/global/A-Container/A-Container.class";
import { HttpServer } from "../contexts/http-server.namespace";
import { createServer, IncomingMessage, Server, ServerResponse } from "http";
import { A_Inject } from "@adaas/a-concept/decorators/A-Inject/A-Inject.decorator";
import { A_Config } from "src/containers/A-Config/A-Config.namespace";
import { A_Lifecycle } from "@adaas/a-concept/decorators/A-ConceptLifecycle";





export class HttpServerRouter extends A_Container<HttpServer> {

    @A_Lifecycle.Load()
    public async listen(
        @A_Inject(A_Config) config: A_Config<'PORT'>
    ) {
        const server = this.namespace.getServer(this.namespace.port);

        // Do something with Server e.g. assign routes
    }

}