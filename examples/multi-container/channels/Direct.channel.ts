import { A_Channel } from "@adaas/a-concept/global/A-Channel/A-Channel.class";
import { A_TYPES__A_ChannelAggregateMethods, A_TYPES__A_ChannelCallParams } from "@adaas/a-concept/global/A-Channel/A-Channel.types";
import { A_Component } from "@adaas/a-concept/global/A-Component/A-Component.class";
import { A_Container } from "@adaas/a-concept/global/A-Container/A-Container.class";


export class DirectChannel<
    T extends A_Container<any>,
> extends A_Channel<[T]> {

    protected instance: T

    constructor(
        public container: T
    ) {
        super({
            id: `direct-channel--${container.name}`
        });

        this.instance = container;
    }


    async call<_Resp extends unknown>(
        prop: A_TYPES__A_ChannelAggregateMethods<[T]>,
        params?: Partial<A_TYPES__A_ChannelCallParams>
    ): Promise<_Resp> {

        if (!this.instance[prop]) {
            throw new Error(`Method ${prop} not found in ${this.instance.name}`);
        }

        return await (this.instance[prop] as any)(params) as Promise<_Resp>;
    }

}



