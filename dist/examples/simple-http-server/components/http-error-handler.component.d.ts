import { HTTPRequest } from "../contexts/http-request.context";
import { A_Logger } from "../../../src/base/A-Logger/A-Logger.component";
import { A_Feature } from "../../../src/global/A-Feature/A-Feature.class";
export declare class HTTPErrorHandler {
    private logger;
    constructor(logger: A_Logger);
    onErrorPage(request: HTTPRequest, feature: A_Feature): Promise<void>;
    onRequest(request: HTTPRequest): Promise<void>;
}
