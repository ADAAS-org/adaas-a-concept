import { A_Connect } from "@adaas/a-concept/decorators/A-Connect/A-Connect.decorator";
import { A_Channel } from "@adaas/a-concept/global/A-Channel/A-Channel.class";
import { A_TYPES__A_ChannelCallParams } from "@adaas/a-concept/global/A-Channel/A-Channel.types";
import { A_Container } from "@adaas/a-concept/global/A-Container/A-Container.class";
import { A_Feature } from "@adaas/a-concept/global/A-Feature/A-Feature.class";
import { ScheduleContainer } from "./Schedule.container";



export class CommandContainer extends A_Container<[
    'execute',
]> {

    constructor() {
        super({});
    }



    @A_Feature.Define({
        name: 'execute',
        // channels: []
    })
    async execute(
        arg: Partial<A_TYPES__A_ChannelCallParams>
    ) {
        console.log('CommandContainer -> command()');
    }




    async doSomething(
        @A_Connect(A_Channel, '') schedule: A_Channel<[ScheduleContainer]>
    ) {

        schedule.call('schedule', {});

    }

}