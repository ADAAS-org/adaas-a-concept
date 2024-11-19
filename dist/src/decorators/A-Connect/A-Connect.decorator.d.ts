import { A_Channel } from "../../global/A-Channel/A-Channel.class";
/**
 * A_Connect decorators allows to establish a connection between the Containers.
 *
 * Depending on the A-Channel implementation the connection could be established in different ways like:
 * - Direct connection (Async Module import)
 * - Remote connection (HTTP, WebSockets)
 * - Local connection (Shared Memory, IPC)
 * - Event-based connection (EventEmitter, PubSub)
 *
 *
 * @param params
 * @returns
 */
export declare function A_Connect(channel: typeof A_Channel, 
/**
 * Connection name
 */
id: string): any;
