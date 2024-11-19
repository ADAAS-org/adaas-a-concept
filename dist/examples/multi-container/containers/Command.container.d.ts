import { A_Channel } from "../../../src/global/A-Channel/A-Channel.class";
import { A_TYPES__A_ChannelCallParams } from "../../../src/global/A-Channel/A-Channel.types";
import { A_Container } from "../../../src/global/A-Container/A-Container.class";
import { ScheduleContainer } from "./Schedule.container";
export declare class CommandContainer extends A_Container<[
    'execute'
]> {
    constructor();
    execute(arg: Partial<A_TYPES__A_ChannelCallParams>): Promise<void>;
    doSomething(schedule: A_Channel<[ScheduleContainer]>): Promise<void>;
}
