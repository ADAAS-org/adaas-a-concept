import { A_Fragment } from "@adaas/a-concept/global/A-Fragment/A-Fragment.class";
import { IncomingMessage, ServerResponse } from "http";




export class HTTPRequest extends A_Fragment {


    public request: IncomingMessage
    public response: ServerResponse

    private _body: any

    state: 'open' | 'end' = 'open'


    constructor(
        request: IncomingMessage,
        response: ServerResponse
    ) {

        super();

        this.request = request;
        this.response = response;
    }


    protected async onInit(): Promise<void> {
        this.response.statusCode = 200;
        this.response.setHeader('Content-Type', 'text/plain');
    }


    async toJSON<T extends any>(): Promise<T> {
        if (!this._body) {
            this._body = await this.parseBody();
        }

        return this._body;
    }

    private parseBody(): Promise<any> {
        return new Promise((resolve, reject) => {
            let body = '';
            this.request.on('data', chunk => body += chunk.toString());
            this.request.on('end', () => resolve(JSON.parse(body)));
            this.request.on('error', reject);
        });
    }


    async end(body: string): Promise<void> {
        this.state = 'end';
        this.response.end(body);
    }

} 