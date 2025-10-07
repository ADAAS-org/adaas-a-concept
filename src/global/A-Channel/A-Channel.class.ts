import { A_Component } from "../A-Component/A-Component.class";
import { A_Container } from "../A-Container/A-Container.class";
import { A_TYPES__A_ChannelAggregated, A_TYPES__A_ChannelAggregateMethods, A_TYPES__A_ChannelCallParams, A_TYPES__A_ChannelConstructor } from "./A-Channel.types";


/**
 * [!] DEPRECATED - use simply A_Component instead
 * 
 * A_Channel is an abstraction over any Communication Type from event emitters to message queues, HTTP requests, etc.
 * 
 * A_Channel uses to connect Containers between each other. When
 * When One container needs to communicate with another container, it uses A_Channel.
 * 
 */
export class A_Channel<
    T extends Array<A_Component | A_Container> = any[],
    _Constructor extends A_TYPES__A_ChannelConstructor = A_TYPES__A_ChannelConstructor
> {

    id: string;

    // protected channel: A_TYPES__A_ChannelAggregated<T>;


    constructor(params: A_TYPES__A_ChannelConstructor) {
        this.id = params.id;

        // this.channel = new Proxy(
        //     {} as A_TYPES__A_ChannelAggregated<T>,
        //     {
        //         get: (target, prop) => {
        //             return async (...args: any[]) => {
        //                 this.call(prop as A_TYPES__A_ChannelAggregateMethods<T>);
        //             };
        //         }
        //     });
    }

    // // fire and forget
    // async send(message: T, options?: unknown): void | Promise<void> { }

    // // request/response
    // async request(message: T, options?: unknown): Promise<R> { }

    // // continuous consumption
    // async consume(handler: (msg: T) => void | Promise<void>, options?: unknown): void { }

    // // pull-based
    // async pull(options?: unknown): Promise<T | null> { }

    // // streaming
    // async stream(): AsyncIterable<T>{

}





// const toUsersChannel = new A_Channel('users');

// const toOrdersChannel = new A_Channel('orders');




// class someComponent extends A_Component {


//     async someMethod(
//         @A_Channel('users') usersChannel: A_Channel,
//     ) {
//         // await toUsersChannel.call('methodName', { fragments: [], components: [A_Component] });
//     }

// }





// class UsersChannel extends A_Channel {
//     constructor(
//         @A_inject(A_Config) config : A_Config
//     ){
//         super('users');
//     }
// }


// class OrdersChannel extends A_Channel { }


// class anotherComponent extends A_Component {
//     async someMethod(
//         @A_inject(UsersChannel) usersChannel: UsersChannel,
//         @A_inject(OrdersChannel) ordersChannel: OrdersChannel,
//     ) {
//         const command = new A_Command();

//         usersChannel
//         .use(someSession)
//         .send(command);


//         await ordersChannel.request(command);


//         // await toUsersChannel.call('methodName', { fragments: [], components: [A_Component] });
//     }
// }
