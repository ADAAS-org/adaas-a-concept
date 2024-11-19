import { A_Channel } from "../../../src/global/A-Channel/A-Channel.class";
import { A_TYPES__A_ChannelAggregateMethods, A_TYPES__A_ChannelCallParams } from "../../../src/global/A-Channel/A-Channel.types";
import { A_Container } from "../../../src/global/A-Container/A-Container.class";
export declare class DirectChannel<T extends A_Container<any>> extends A_Channel<[T]> {
    container: T;
    protected instance: T;
    constructor(container: T);
    call<_Resp extends unknown>(prop: A_TYPES__A_ChannelAggregateMethods<[T]>, params?: Partial<A_TYPES__A_ChannelCallParams>): Promise<_Resp>;
}
