import { A_Entity } from "../../../src/global/A-Entity/A-Entity.class";
import { A_TYPES__EntityBaseMethods } from "../../../src/global/A-Entity/A-Entity.types";
export declare class EntityA extends A_Entity<any, any, [
    ...A_TYPES__EntityBaseMethods,
    'doSomething'
]> {
    doSomething(): Promise<void>;
}
