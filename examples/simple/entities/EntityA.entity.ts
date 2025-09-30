import { A_Entity } from "@adaas/a-concept/global/A-Entity/A-Entity.class";
import { A_TYPES__EntityBaseMethods } from "@adaas/a-concept/global/A-Entity/A-Entity.types";
import { ASEID } from "@adaas/a-utils";
import { A_Feature } from "index";



export class EntityA extends A_Entity {


    public bar: string = 'bar';

    get Foo(){
        return 'bar';
    }

    fromNew(newEntity: any): void {

        this.aseid = new ASEID({
            namespace: 'default',
            scope: 'default',
            entity: 'entity-a',
            id: Math.floor(Math.random() * 1000000000).toString(),
        })
        this.bar = newEntity.bar;
    }

    @A_Feature.Define()
    async doSomething() {
        await this.call('doSomething');
    }
}