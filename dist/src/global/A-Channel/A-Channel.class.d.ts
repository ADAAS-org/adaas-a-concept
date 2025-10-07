import { A_Component } from "../A-Component/A-Component.class";
import { A_Container } from "../A-Container/A-Container.class";
import { A_TYPES__A_ChannelConstructor } from "./A-Channel.types";
/**
 * [!] DEPRECATED - use simply A_Component instead
 *
 * A_Channel is an abstraction over any Communication Type from event emitters to message queues, HTTP requests, etc.
 *
 * A_Channel uses to connect Containers between each other. When
 * When One container needs to communicate with another container, it uses A_Channel.
 *
 */
export declare class A_Channel<T extends Array<A_Component | A_Container> = any[], _Constructor extends A_TYPES__A_ChannelConstructor = A_TYPES__A_ChannelConstructor> {
    id: string;
    constructor(params: A_TYPES__A_ChannelConstructor);
}
