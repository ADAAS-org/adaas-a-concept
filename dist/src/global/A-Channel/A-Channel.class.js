"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_Channel = void 0;
/**
 * [!] DEPRECATED - use simply A_Component instead
 *
 * A_Channel is an abstraction over any Communication Type from event emitters to message queues, HTTP requests, etc.
 *
 * A_Channel uses to connect Containers between each other. When
 * When One container needs to communicate with another container, it uses A_Channel.
 *
 */
class A_Channel {
    // protected channel: A_TYPES__A_ChannelAggregated<T>;
    constructor(params) {
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
}
exports.A_Channel = A_Channel;
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
//# sourceMappingURL=A-Channel.class.js.map