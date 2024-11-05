import { A_Inject } from "@adaas/a-concept/decorators/A-Inject/A-Inject.decorator";
import { HTTPRequest } from "../contexts/http-request.context";
import { A_Logger } from "@adaas/a-concept/base/A-Logger/A-Logger.component";
import { HttpServer } from "../containers/http-server.container";
import { A_Feature } from "@adaas/a-concept/global/A-Feature/A-Feature.class";
import { A_Component } from "@adaas/a-concept/global/A-Component/A-Component.class";


export class HTTPErrorHandler extends A_Component {

    constructor(
        @A_Inject(A_Logger) private logger: A_Logger
    ) {
        super();
    }



    @A_Feature.Extend({
        name: 'onRequest',
        scope: [HttpServer]
    })
    async onErrorPage(
        @A_Inject(HTTPRequest) request: HTTPRequest,
        @A_Inject(A_Feature) feature: A_Feature
    ) {
        this.logger.log('HTTP Error Handler -> onErrorPage()');

        await feature.completed();

        if (request.state !== 'end' && request.request.url === '/error')
            request.end('Error Page');

    }



    @A_Feature.Extend()
    async onRequest(
        @A_Inject(HTTPRequest) request: HTTPRequest
    ) {
        this.logger.log('HTTP Error Handler -> onRequest()');

        if (request.state !== 'end')
            request.end('Error');
    }
}