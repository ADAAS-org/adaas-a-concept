
// declare module "../modules/simple-http-server.types" {
//     interface SimpleHTTPServerModuleControllers {
//         Orders: OrderController
//     }
// }

import { A_Component } from "@adaas/a-concept/global/A-Component/A-Component.class"

export class OrderController extends A_Component {

    async makeSome1() {
        console.log('Making some request')
    }

    async makeSome2() {
        console.log('Making some request')
    }

}