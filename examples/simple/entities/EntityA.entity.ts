import { A_Entity } from "@adaas/a-concept/global/A-Entity/A-Entity.class";
import { A_TYPES__EntityBaseMethods } from "@adaas/a-concept/global/A-Entity/A-Entity.types";
import { A_Feature } from "index";



export class EntityA extends A_Entity {


    @A_Feature.Define()
    async doSomething() {
        await this.call('doSomething');
    }
}