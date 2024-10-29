import { A_Container } from "@adaas/a-concept/global/A-Container/A-Container.class";
import { createServer, IncomingMessage, Server, ServerResponse } from "http";
import { A_Inject } from "@adaas/a-concept/decorators/A-Inject/A-Inject.decorator";
// import { A_Feature } from "@adaas/a-concept/decorators/A-Feature/A-Feature.decorator";
import { A_Concept } from "@adaas/a-concept/global/A-Concept/A_Concept.class";
import { A_Config } from "@adaas/a-concept/base/A-Config/A-Config.context";
import { A_Feature } from "@adaas/a-concept/global/A-Feature/A-Feature.class";
import { HTTPRequest } from "../contexts/http-request.context";





export class HttpServer extends A_Container<['start', 'stop', 'onRequest']> {

    server!: Server
    port!: number


    @A_Concept.Load()
    async create(
        @A_Inject(A_Config) config: A_Config<'PORT'>
    ) {
        // Set the server to listen on port 3000
        this.port = config.get('PORT') || 3000;

        // Create the HTTP server
        this.server = createServer(this.onRequest.bind(this));
    }

    @A_Concept.Start()
    async run() {
        this.server.listen(this.port, () => {
            console.log(`Server is running on http://localhost:${this.port}`);
        });
    }


    @A_Feature.Define()
    async onRequest(
        req: IncomingMessage,
        res: ServerResponse
    ) {
        return await this.call('onRequest', {
            fragments: [
                new HTTPRequest(req, res)
            ]
        });
    }


    @A_Concept.Stop()
    async stop() { }
}