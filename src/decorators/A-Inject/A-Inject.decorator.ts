import { A_Namespace } from "@adaas/a-concept/global/A-Namespace/A_Namespace.class";
import { A_Context } from "@adaas/a-concept/global/A-Context/A-Context.class";
import { A_Component } from "@adaas/a-concept/global/A-Component/A-Component.class";

/**
 * A-Inject decorator
 * 
 * This Decorator allows to inject dependencies into the module like 
 * - Namespaces 
 * - Other Concepts 
 * - or maybe Components
 * 
 * @param params 
 * @returns 
 */
export function A_Inject<
    T extends { new(...args: any[]): A_Component }
>(
    component: T
)
export function A_Inject<
    T extends { new(...args: any[]): A_Namespace }
>(
    namespace: T
)
export function A_Inject<
    E extends { new(...args: any[]): A_Namespace },
    T extends Array<E>
>(
    namespaces: T
)
export function A_Inject<
    E extends { new(...args: any[]): A_Namespace },
    K extends { new(...args: any[]): A_Component },
    T extends Array<E>
>(
    param1: T | E | K
) {
    switch (true) {
        case param1 instanceof A_Component:
            return function (
                target: T,
                propertyKey: string | symbol,
                parameterIndex: number
            ) {
                //  It should be just register the parameter in method that will be resolved in the method
            }
        case param1 instanceof A_Namespace:
            return function (
                target: T,
                propertyKey: string | symbol,
                parameterIndex: number
            ) {
                //  It should be just register the parameter in method that will be resolved in the method
            }
    }

    // const namespaces: Array<typeof A_Namespace> = [
    //     ...(Array.isArray(param1) ? param1 : [param1])
    // ];

    // const resolvedNamespaces: Array<A_Namespace> = []

    // for (const namespace of namespaces) {
    //     resolvedNamespaces.push(A_Context.resolve(namespace));
    // }

    // return function (
    //     target: T | E,
    //     propertyKey: string | symbol,
    //     parameterIndex: number
    // ) {
    //     //  It should be just register the parameter in method that will be resolved in the method
    // }
}