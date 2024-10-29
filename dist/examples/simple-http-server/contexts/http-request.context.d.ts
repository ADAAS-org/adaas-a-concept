import { A_Fragment } from "../../../src/global/A-Fragment/A-Fragment.class";
import { IncomingMessage, ServerResponse } from "http";
export declare class HTTPRequest extends A_Fragment {
    request: IncomingMessage;
    response: ServerResponse;
    private _body;
    state: 'open' | 'end';
    constructor(request: IncomingMessage, response: ServerResponse);
    protected onInit(): Promise<void>;
    toJSON<T extends any>(): Promise<T>;
    private parseBody;
    end(body: string): Promise<void>;
}
