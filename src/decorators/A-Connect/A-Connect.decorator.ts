import { A_Component } from "@adaas/a-concept/global/A-Component/A-Component.class";
import { A_Context } from "@adaas/a-concept/global/A-Context/A-Context.class";
import { A_Container } from "@adaas/a-concept/global/A-Container/A-Container.class";
import { A_ContainerMeta } from "@adaas/a-concept/global/A-Container/A-Container.meta";
import { A_ComponentMeta } from "@adaas/a-concept/global/A-Component/A-Component.meta";
import { A_Channel } from "@adaas/a-concept/global/A-Channel/A-Channel.class";


/**
 * A_Connect decorators allows to establish a connection between the Containers.
 * 
 * Depending on the A-Channel implementation the connection could be established in different ways like:
 * - Direct connection (Async Module import)
 * - Remote connection (HTTP, WebSockets)
 * - Local connection (Shared Memory, IPC)
 * - Event-based connection (EventEmitter, PubSub)
 * 
 * 
 * @param params 
 * @returns 
 */
export function A_Connect(
    channel: typeof A_Channel,
    /**
     * Connection name
     */
    id: string
)
export function A_Connect(
    channel: typeof A_Channel,
    config?: any | string
) {
    return function (
        target: A_Container | A_Component,
        methodName: string | symbol | undefined,
        parameterIndex: number
    ) {

        const meta: A_ContainerMeta | A_ComponentMeta = A_Context.meta(target as any);

        let metaKey;


        // // Get the existed metadata or create a new one
        // const existedMeta: A_Meta<{
        //     [Key: string]: A_TYPES__ContainerMeta_StageExtension[];
        // }> = meta.get(metaKey) || new A_Meta();

        // // Set the metadata of the method to define a custom Stage with name
        // const existedMetaValue = existedMeta.get(StageKey) || [];

        // // Add the new method to the metadata
        // existedMetaValue.push({
        //     name: method,
        //     handler: propertyKey,
        // });

        // // Set the metadata of the method to define a custom Feature with name
        // existedMeta.set(StageKey, existedMetaValue);


        // //  Update the metadata of the container with the new Stage definition
        // A_Context
        //     .meta(target as any)
        //     .set(
        //         metaKey,
        //         existedMeta
        //     );

    };
}
