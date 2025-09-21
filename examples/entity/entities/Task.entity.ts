import { A_Entity } from "@adaas/a-concept/global/A-Entity/A-Entity.class";
import { A_Feature } from "@adaas/a-concept/global/A-Feature/A-Feature.class";
import { A_Error, A_TYPES__AEntity_JSON, ASEID } from "@adaas/a-utils";
import { User } from "./User.entity";


export type NewTask = {
    title: string;
    description: string;
    completed?: boolean;
    assignedTo?: A_Entity;
}

export type SerializedTask = {
    title: string;
    description: string;
    completed: boolean;
    assignedToASEID?: string;
} & A_TYPES__AEntity_JSON



export class Task extends A_Entity<NewTask, SerializedTask> {
    title: string = '';
    description: string = '';
    completed: boolean = false;
    link?: string;

    assignedTo?: User;

    get id(): string | number {
        return Number(this.aseid.id);
    }


    protected getInitializer(props: string | NewTask | SerializedTask | ASEID): (props: any) => void {



        let initialized: ((props: any) => void) | undefined = undefined
        try {
            initialized = super.getInitializer(props);

        } catch (error) {
        }

        if (typeof props === 'string' && /^https?:\/\//.test(props)) {
            initialized = this.fromLink.bind(this);
        }

        if (!initialized) {
            throw new A_Error('Cannot initialize Task entity with the provided argument. Supported arguments are: ASEID, SerializedTask, NewTask, or a link (string starting with http:// or https://)');
        }


        console.log('Initializer for Task:', props, '\n', initialized?.name);

        return initialized;
    }


    fromNew(newEntity: NewTask): void {
        this.aseid = new ASEID({
            namespace: 'example',
            scope: 'default',
            entity: 'task',
            id: Math.floor(Math.random() * 1000000000).toString(),
        });

        this.title = newEntity.title;
        this.description = newEntity.description;
        this.completed = newEntity.completed ?? false;
        if (newEntity.assignedTo)
            this.assignedTo = newEntity.assignedTo as User;
    }


    fromLink(link: string): void {
        this.aseid = new ASEID({
            namespace: 'example',
            scope: 'default',
            entity: 'task',
            id: new Date().getTime(),
        });

        this.link = link;
        this.title = `Task from link: ${link}`;
        this.description = `This task was created from the link: ${link}`;
        this.completed = false;
    }


    @A_Feature.Define({ invoke: true })
    assignTo(user: User) {
        this.assignedTo = user;
    }



    toJSON(): SerializedTask {
        return {
            ...super.toJSON(),
            title: this.title,
            description: this.description,
            completed: this.completed,
            assignedToASEID: this.assignedTo?.aseid.toString(),
        }
    }

}