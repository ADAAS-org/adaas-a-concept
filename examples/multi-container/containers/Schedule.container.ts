import { A_Connect } from "@adaas/a-concept/decorators/A-Connect/A-Connect.decorator";
import { A_Feature_Define } from "@adaas/a-concept/decorators/A-Feature/A-Feature-Define.decorator";
import { A_Inject } from "@adaas/a-concept/decorators/A-Inject/A-Inject.decorator";
import { A_Channel } from "@adaas/a-concept/global/A-Channel/A-Channel.class";
import { A_Container } from "@adaas/a-concept/global/A-Container/A-Container.class";
import { CommandContainer } from "./Command.container";
import { A_TYPES__A_ExecutableMethods } from "@adaas/a-concept/global/A-Channel/A-Channel.types";


export class ScheduleContainer extends A_Container<[
    'schedule',
    'start',
    'stop',
    'pause',
]> {

    private tasks = [];


    constructor() {
        super({});
    }



    @A_Feature_Define({
        name: 'schedule',
        // channels: []
    })
    async schedule(
        // @A_Inject('task') task: any
    ) {
        console.log('ScheduleContainer -> schedule()');
    }



    @A_Feature_Define({
        name: 'start',
        // channels: []
    })
    async start() {
        console.log('ScheduleContainer -> start()');
    }



    async onExecution(
        @A_Connect(A_Channel, '') commands: A_Channel<[CommandContainer]>
    ) {
        const result = await commands.call('execute', {
            fragments: []
        });

    }

}
