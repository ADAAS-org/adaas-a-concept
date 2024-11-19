// import { A_Container } from "@adaas/a-concept/global/A-Container/A-Container.class";
// import { A_Feature } from "@adaas/a-concept/global/A-Feature/A-Feature.class";
// import EventEmitter from "events";

// type MethodsOfComponent<T> = T extends typeof BaseComponent<infer M extends Array<string>> ? M : never;



// class BaseComponent<_Methods extends string[] = []> {

//     constructor(
//         private params?: Partial<{
//             exports: _Methods
//         }>) {

//     }
// }

// class BaseContainer<_AllComponents extends typeof BaseComponent<string[]>[]> {

//     constructor(public components: _AllComponents) {
//         // this.allMethods = components
//         //     .map((component) => component.methods)
//         //     .flat(); // Extract methods at runtime
//     }


//     callMethod(method: MethodsOfComponent<_AllComponents[number]>[number]) {
//         // if (!this.allMethods.includes(method)) {
//         //     throw new Error(`Method ${method} is not available.`);
//         // }
//         console.log(`Calling method: ${method}`);
//     }
// }



// // Define your components
// class ComponentA extends BaseComponent<['doSomething']> {
//     // constructor() {
//     //     super(['doSomething']);
//     // }
// }


// type ProxyTypeWithMethods<T> = T extends BaseContainer<infer M extends typeof BaseComponent<string[]>[]> ? MethodsOfComponent<M[number]> : never;


// class channel<T extends BaseContainer<typeof BaseComponent<string[]>[]>> {


//     getProvider()
//         : {
//             [K in ProxyTypeWithMethods<T>[number]]: () => void
//         } {
//         return new Proxy({} as any, {
//             get(target, prop, receiver) {
//                 return target[prop];
//             }
//         });
//     }
// }

// class ComponentB extends BaseComponent<['doAnotherThing']> {
//     // constructor() {
//     //     super(['doAnotherThing']);
//     // }



//     method3() {


//     }
// }

// // Instantiate the container
// const container = new BaseContainer([
//     ComponentA,
//     ComponentB
// ]);





// // Correct usage
// container.callMethod('doSomething'); // Calling method: doSomething
// container.callMethod('doAnotherThing'); // Calling method: doAnotherThing



// const channelInstance = new channel<typeof container>();

// const provider = channelInstance.getProvider();

// provider.doAnotherThing();


// // Incorrect usage
// // container.callMethod('nonExistentMethod'); // Throws error: Method nonExistentMethod is not available

