import { HTTPRequest } from "../contexts/http-request.context";
import { A_Logger } from "../../../src/base/A-Logger/A-Logger.component";
import { A_Feature } from "../../../src/global/A-Feature/A-Feature.class";
import { A_Component } from "../../../src/global/A-Component/A-Component.class";
export declare class HTTPErrorHandler extends A_Component {
    private logger;
    constructor(logger: A_Logger);
    onErrorPage(request: HTTPRequest, feature: A_Feature): Promise<void>;
    onRequest(request: HTTPRequest): Promise<void>;
}
