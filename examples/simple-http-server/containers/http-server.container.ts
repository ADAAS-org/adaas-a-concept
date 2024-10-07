import { A_Container } from "@adaas/a-concept/global/A-Container/A-Container.class";
import { HttpServer } from "../contexts/http-server.namespace";
import { createServer, IncomingMessage, Server, ServerResponse } from "http";
import { A_Run } from "@adaas/a-concept/decorators/A-ConceptLifecycle/A-Run/A-Run.decorator";
import { A_Inject } from "@adaas/a-concept/decorators/A-Inject/A-Inject.decorator";
// import { A_Feature } from "@adaas/a-concept/decorators/A-Feature/A-Feature.decorator";
import { A_Concept } from "@adaas/a-concept/global/A-Concept/A_Concept.class";
import { A_TYPES__A_CONCEPT_RootRunParams } from "@adaas/a-concept/global/A-Concept/A_Concept.types";
import { A_Lifecycle } from "@adaas/a-concept/decorators/A-ConceptLifecycle";
import { A_Config } from "src/containers/A-Config/A-Config.namespace";





export class DefaultHttpServer extends A_Container<HttpServer> {

    server!: Server
    port!: number

    @A_Lifecycle.Load()
    public async create(
        concept: A_Concept,
        @A_Inject(A_Config) config: A_Config<'PORT'>
    ) {
        // Set the server to listen on port 3000
        this.port = config.get('PORT') || 3000;

        // Create the HTTP server
        this.server = createServer((req: IncomingMessage, res: ServerResponse) => {
            // Set the response headers
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');

            // Routing logic (basic example)
            if (req.url === '/') {
                res.end('Welcome to the homepage!');
            } else if (req.url === '/about') {
                res.end('Welcome to the about page!');
            } else {
                res.statusCode = 404;
                res.end('404 - Page not found');
            }
        });

        this.namespace.registerServer(this.server, this.port);
    }



    @A_Run({})
    async run(
        params: A_TYPES__A_CONCEPT_RootRunParams,
    ) {
        this.server.listen(this.port, () => {
            console.log(`Server is running on http://localhost:${this.port}`);
        });
    }



    // @A_Feature({
    //     name: 'stop',
    //     description: 'Stop the server'
    // })
    // async stop() {

    // }
}