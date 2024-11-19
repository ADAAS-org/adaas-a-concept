// import { A_Inject } from "@adaas/a-concept/decorators/A-Inject/A-Inject.decorator";
// import { A_Component } from "@adaas/a-concept/global/A-Component/A-Component.class";
// import { A_Container } from "@adaas/a-concept/global/A-Container/A-Container.class";
// import { A_Feature } from "@adaas/a-concept/global/A-Feature/A-Feature.class";
// import { EventEmitter } from "stream";


// class ComponentA extends A_Component<[
//     'method1',
//     'method2'
// ]> {

//     @A_Feature.Define({
//         name: 'method1',
//         channels: []
//     } as any)
//     async method1() {

//     }

//     @A_Feature.Define({
//         name: 'method2',
//         channels: []
//     } as any)
//     async method2() {

//     }
// }


// class ComponentB extends A_Component<[
//     'ComponentB_method3',
//     'ComponentB_method4'
// ]> {

//     @A_Feature.Define({
//         name: 'ComponentB_method3',
//         channels: []
//     } as any)
//     async ComponentB_method3(param1: {
//         key: string
//     }) {

//     }

//     @A_Feature.Define({
//         name: 'ComponentB_method4',
//         channels: []
//     } as any)
//     async ComponentB_method4(foo: number) {

//     }
// }



// type MethodsWithSpecificArg<T, ArgType> = {
//     [K in keyof T]: T[K] extends (arg: ArgType, ...args: any[]) => Promise<any> ? K : never
// }[keyof T];

// // Example argument type
// type SpecificArgType = { key: string };

// type AggregateMethods<TClasses extends A_Component[]> = {
//     [K in keyof TClasses]: TClasses[K] extends infer Instance
//     ? MethodsWithSpecificArg<Instance, SpecificArgType>
//     : never;
// }[number];


// type MethodObject2<TClasses extends any[]> = {
//     [Method in AggregateMethods<TClasses>]: {
//         [Class in keyof TClasses]: TClasses[Class] extends infer Instance
//         ? Method extends keyof Instance
//         ? Instance[Method]
//         : never
//         : never;
//     }[number]; // Select the method signature from any matching class
// };



// // decorator to create a channel 
// function A_Connect() {
//     return function (target: any, prop: string) {
//         console.log('A_Connect', target, prop);
//     }
// }



// class Channel<T extends A_Component[]> {

//     channel: MethodObject2<T>;

//     constructor() {
//         this.channel = new Proxy(
//             {} as MethodObject2<T>,
//             {
//                 get: (target, prop) => {
//                     return async (...args: any[]) => {
//                         this.call(prop as AggregateMethods<T>);
//                     };
//                 }
//             });
//     }


//     async call(prop: AggregateMethods<T>) {
//         // do HTTP Call or just inject class or whatever you want

//         console.log('Calling method', prop);
//     }

// }




// class HTTP<T extends A_Component[]> extends Channel<T> {

//     async call(prop: AggregateMethods<T>): Promise<void> {

//         console.log('HTTP Call', prop);
//     }
// }

// class ConceptDirect<T extends A_Component[]> extends Channel<T> {

//     // protected originalInstance: T;

//     async call(prop: AggregateMethods<T>): Promise<void> {
//         console.log('Direct Call', prop);
//     }

// }



// class ConceptEE extends Channel<any> {

//     private emitter: EventEmitter = new EventEmitter();

//     constructor() {
//         super();
//     }

//     async call(prop: string): Promise<void> {
//         console.log('EE Call', prop);
//     }

//     on = this.emitter.on.bind(this.emitter);

//     emit = this.emitter.emit.bind(this.emitter);

// }





















// class FooContainer extends A_Container<[
//     'doSomething',
//     'doAnotherThing'
// ]> {


//     @A_Feature.Define({
//         name: 'doSomething',
//         channels: [ConceptDirect, HTTP]
//     } as any)
//     async doSomething(
//         @A_Inject(HTTP) http: HTTP<[ComponentA, ComponentB]>,
//     ) {

//         // @A_Connect(http, 'ComponentB_method3')

//         const foo = await http.channel.ComponentB_method3({
//             key: 'value'
//         });
//     }




//     @A_Feature.Define({
//         name: 'doAnotherThing',
//         channels: [HTTP]
//     } as any)
//     async onRequest() {
//         await this.call('doSomething');
//     }
// }




