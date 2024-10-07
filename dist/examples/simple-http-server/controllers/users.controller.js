"use strict";
// import { A_Load } from "../../../src/decorators/A-ConceptLifecycle/A-Load/A-Load.decorator"
// import { A_Module } from "@adaas/a-concept/global/A_Module.class"
// import { SimpleHTTPServerModule } from "../modules/simple-http-server.module"
// import { IncomingMessage, ServerResponse } from "http"
// import { SimpleHTTPServerContext } from "../modules/simple-http-server.context"
// import { A_Dependency } from "@adaas/a-concept/decorators/A-Dependency/A-Dependency.decorator"
// import { A_Run } from "../../../src/decorators/A-ConceptLifecycle/A-Run/A-Run.decorator"
// import { A_Inject } from "../../../src/decorators/A-Inject/A-Inject.decorator"
// import { OrderController } from "./orders.controller"
// declare module "../modules/simple-http-server.types" {
//     interface SimpleHTTPServerModuleControllers {
//         Users: UserController
//     }
// }
// declare module "../modules/simple-http-server.context" {
//     interface SimpleHTTPServerContext {
//         users: Array<any>
//     }
// }
// // @A_Dependency({
// //     name: 'users-controller',
// //     version: '0.0.1',
// //     dependencies: [
// //         SimpleHTTPServerModule
// //     ]
// // })
// export class UserController extends A_Module {
//     private SomeModule = A_Inject(OrderController) 
//     @A_Load(
//         // after: [SimpleHTTPServerModule]
//     )
//     async defineListeners(
//     ) {
//         /**
//          * Approach with Dependency Manager allows to resolve the module and context in the method
//          */
//         const simpleHTTPServerModule1 = await this.DM.resolve(SimpleHTTPServerModule);
//         const context1 = await this.DM.resolve(SimpleHTTPServerContext);
//         /**
//          * OR
//          * 
//          * It's possible to resolve multiple dependencies at once
//          */
//         const [
//             simpleHTTPServerModule2,
//             context
//         ] = await this.DM.resolve([
//             SimpleHTTPServerModule,
//             SimpleHTTPServerContext
//         ]);
//         // simpleHTTPServerModule.create();
//         context.users = [
//             { id: 1, name: 'John Doe' },
//             { id: 2, name: 'Jane Doe' }
//         ];
//     }
//     @A_Load()
//     /**
//      * 
//      * Approach with direct injection allows to use the module directly in the method
//      * However, this approach is not recommended as it makes the code less readable and testable
//      * In the example below Injection changes the original method signature that may impact the readability/testability of the code
//      * 
//      */
//     async run(
//         @A_Inject(SimpleHTTPServerModule) simpleHTTPServerModule: SimpleHTTPServerModule
//     ) {
//         // simpleHTTPServerModule.create();
//     }
//     async getUser(
//         req: IncomingMessage,
//         res: ServerResponse,
//         id: number
//     ) {
//         const context = new SimpleHTTPServerContext()
//         const user = context.users.find(u => u.id === id);
//         if (user) {
//             res.writeHead(200);
//             res.end(JSON.stringify(user));
//         } else {
//             res.writeHead(404);
//             res.end(JSON.stringify({ message: 'User not found' }));
//         }
//     }
// }
//# sourceMappingURL=users.controller.js.map