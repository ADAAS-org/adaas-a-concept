import { A_ComponentMeta } from "@adaas/a-concept/a-component";
import { A_ContainerMeta } from "@adaas/a-concept/a-container";
import { A_EntityMeta } from "@adaas/a-concept/a-entity";



export type A_TYPES__ContextEnvironment = 'server' | 'browser' | 'mobile' | 'desktop' | 'embedded' | 'unknown';




export type A_TYPES__FeatureExtendableMeta = A_ContainerMeta
    | A_ComponentMeta
    | A_EntityMeta