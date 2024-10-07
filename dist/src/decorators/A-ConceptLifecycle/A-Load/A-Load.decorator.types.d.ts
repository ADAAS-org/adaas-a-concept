import { A_TYPES__ConceptLifecycle_MethodDeclarationConfig } from "../A-ConceptLifecycle.decorator.types";
export type A_TYPES__A_LoadDecoratorDescriptor = TypedPropertyDescriptor<(...args: any[]) => void> | TypedPropertyDescriptor<(...args: any[]) => Promise<void>>;
export type A_TYPES__A_LoadDecoratorConfig = {} & A_TYPES__ConceptLifecycle_MethodDeclarationConfig;
export type A_TYPES__A_LoadDecoratorStorageInstruction = {
    handler: string;
    config: A_TYPES__A_LoadDecoratorConfig;
};
