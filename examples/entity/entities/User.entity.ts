import { A_Entity } from "@adaas/a-concept/global/A-Entity/A-Entity.class";
import { A_TYPES__Entity_JSON } from "@adaas/a-concept/global/A-Entity/A-Entity.types";
import { ASEID } from "@adaas/a-utils";


export type NewUser = {
    name: string;
    email: string;
}

export type SerializedUser = {
    name: string;
    email: string;
} & A_TYPES__Entity_JSON





export class User extends A_Entity<NewUser, SerializedUser> {

    name: string = '';
    email: string = '';


    get id(): string | number {
        return Number(this.aseid.id);
    }


    fromNew(newEntity: NewUser): void {
        this.aseid = new ASEID({
            namespace: 'example',
            scope: 'default',
            entity: 'user',
            id: Math.floor(Math.random() * 1000000000).toString(),
        });

        this.name = newEntity.name;
        this.email = newEntity.email;
    }


    fromJSON(serialized: SerializedUser): void {
        this.aseid = new ASEID(serialized.aseid);
        this.name = serialized.name;
        this.email = serialized.email;
    }




    toJSON(): SerializedUser {
        return {
            ...super.toJSON(),
            name: this.name,
            email: this.email,
        }
    }


}