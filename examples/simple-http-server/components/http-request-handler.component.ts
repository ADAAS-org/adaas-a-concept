import { A_Component } from "@adaas/a-concept/global/A-Component/A-Component.class";
import { A_Feature } from "index";

export class HTTPRequestHandler extends A_Component {



    @A_Feature.Extend()
    onRequest() {
        console.log('HTTPRequestHandler -> onRequest()');
    }

}