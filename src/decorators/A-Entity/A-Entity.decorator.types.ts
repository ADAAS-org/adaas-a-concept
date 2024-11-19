import { A_Entity } from "@adaas/a-concept/global/A-Entity/A-Entity.class"
import { ASEID } from "@adaas/a-utils"



export type A_TYPES__EntityListDecoratorQuery = {
    aseid: string | ASEID,
    id: string,
    type: { new(...args: any[]): A_Entity<any, any, any> },
    entity: string
}



export type A_TYPES__EntityListDecoratorPagination = {
    limit: number,
    offset: number
}