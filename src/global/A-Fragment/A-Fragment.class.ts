import { A_Meta } from "../A-Meta/A-Meta.class";
import { A_TYPES__Fragment_Init } from "./A-Fragment.types";



export class A_Fragment<
    _MemoryItems extends Record<string, any> = any
> {
    /**
     * Fragment Name
     */
    name: string;
    /**
     * Memory storage for the Fragment instance
     */
    protected _meta: A_Meta<_MemoryItems> = new A_Meta<_MemoryItems>();


    /**
     * A-Fragment is a singleton, a piece of execution Context that can be shared between the Components/Entities/Commands
     * For every A_Scope can be defined only One A_Fragment of the same type. 
     * This class is useful for the design purpose and maintainance of the application
     * 
     * 
     * [!] Every A_Fragment is a Memory Class that can store data in memory between the steps of the pipeline.
     * [!] So if it necessary to store some information in the Execution Context - use memory of the Fragment
     */
    constructor(params: Partial<A_TYPES__Fragment_Init> = {}) {
        /**
         * Register the Namespace in the global Namespace provider
         */
        this.name = params.name || this.constructor.name;
    }

    /**
     * Returns the Meta object that allows to store data in the Fragment memory
     * 
     * @returns
     */
    get memory(): A_Meta<_MemoryItems> {
        return this._meta;
    }




    /**
     * Returns the JSON representation of the Fragment
     * 
     * @returns 
     */
    toJSON(): _MemoryItems & { name: string } {
        return {
            name: this.name,
            ...this.memory.toArray().reduce((acc, [key, value]) => {
                acc[key] = value;
                return acc;
            }, {} as _MemoryItems)
        };
    }

}