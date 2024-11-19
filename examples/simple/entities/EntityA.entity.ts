import { A_Entity } from "@adaas/a-concept/global/A-Entity/A-Entity.class";
import { A_TYPES__EntityBaseMethods } from "@adaas/a-concept/global/A-Entity/A-Entity.types";



export class EntityA extends A_Entity<any, any, [
    ...A_TYPES__EntityBaseMethods,
    'doSomething'
]> {



    async doSomething() {
        await this.call('doSomething');
    }
}