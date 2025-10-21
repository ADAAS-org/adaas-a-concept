import { A_ComponentMeta } from "../A-Component/A-Component.meta";
import { A_ContainerMeta } from "../A-Container/A-Container.meta";
import { A_EntityMeta } from "../A-Entity/A-Entity.meta";



export type A_TYPES__ContextEnvironment = 'server' | 'browser' | 'mobile' | 'desktop' | 'embedded' | 'unknown';




export type A_TYPES__FeatureExtendableMeta = A_ContainerMeta
    | A_ComponentMeta
    | A_EntityMeta