import { A_TYPES__Dictionary } from "@adaas/a-utils";
import { A_Component } from "../A-Component/A-Component.class";
import { A_Container } from "../A-Container/A-Container.class";



/**
 * A Meta is an entity that stores all the metadata for the specific entity like container, component, feature, etc. 
 * 
 * [!] Meta can be different depending on the type of input data
 */
export class A_Meta<
    _StorageItems extends Record<string, any>
// _StorageItems extends Record<string, Map<string | Symbol, any> | Array<any> | A_TYPES__Dictionary<any>>
> {

    protected meta: Map<keyof _StorageItems, _StorageItems[keyof _StorageItems]> = new Map();


    from(
        meta: A_Meta<_StorageItems>
    ): A_Meta<_StorageItems> {
        this.meta = new Map(meta.meta);

        return this;
    }


    // ===================================================================================================
    // ================================ META OPERATIONS ==================================================
    // ===================================================================================================

    // Method to set values in the map
    set<K extends keyof _StorageItems>(key: K, value: _StorageItems[K]) {

        const inheritedValue = this.meta.get(key)
            || Array.isArray(value)
            ? []
            : (value as any) instanceof Map
                ? new Map()
                : {};
        const targetValue = this.meta.get(key)
            || Array.isArray(value)
            ? [
                ...inheritedValue as any
            ] : (value as any) instanceof Map
                ? new Map(inheritedValue as any)
                : { ...inheritedValue };

        this.meta.set(key, value);

    }

    // Method to get values from the map
    get<K extends keyof _StorageItems>(key: K): _StorageItems[K] | undefined {
        return this.meta.get(key) as _StorageItems[K];
    }
}


