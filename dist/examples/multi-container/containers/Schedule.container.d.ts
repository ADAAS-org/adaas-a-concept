import { A_Channel } from "../../../src/global/A-Channel/A-Channel.class";
import { A_Container } from "../../../src/global/A-Container/A-Container.class";
import { CommandContainer } from "./Command.container";
export declare class ScheduleContainer extends A_Container<[
    'schedule',
    'start',
    'stop',
    'pause'
]> {
    private tasks;
    constructor();
    schedule(): Promise<void>;
    start(): Promise<void>;
    onExecution(commands: A_Channel<[CommandContainer]>): Promise<void>;
}
