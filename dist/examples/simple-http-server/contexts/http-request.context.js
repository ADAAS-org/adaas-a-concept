"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTTPRequest = void 0;
const A_Fragment_class_1 = require("../../../src/global/A-Fragment/A-Fragment.class");
class HTTPRequest extends A_Fragment_class_1.A_Fragment {
    constructor(request, response) {
        super();
        this.state = 'open';
        this.request = request;
        this.response = response;
    }
    onInit() {
        return __awaiter(this, void 0, void 0, function* () {
            this.response.statusCode = 200;
            this.response.setHeader('Content-Type', 'text/plain');
        });
    }
    // async toJSON<T extends any>(): Promise<T> {
    //     if (!this._body) {
    //         this._body = await this.parseBody();
    //     }
    //     return this._body;
    // }
    parseBody() {
        return new Promise((resolve, reject) => {
            let body = '';
            this.request.on('data', chunk => body += chunk.toString());
            this.request.on('end', () => resolve(JSON.parse(body)));
            this.request.on('error', reject);
        });
    }
    end(body) {
        return __awaiter(this, void 0, void 0, function* () {
            this.state = 'end';
            this.response.end(body);
        });
    }
}
exports.HTTPRequest = HTTPRequest;
//# sourceMappingURL=http-request.context.js.map