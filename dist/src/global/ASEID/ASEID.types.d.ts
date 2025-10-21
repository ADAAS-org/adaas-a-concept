export interface A_TYPES__ASEID_Constructor {
    /**
     * Concept for the ASEID
     * Generally it is the application name or code, should correspond to the concept where the entity is used
     * Could be ID or ASEID
     */
    concept?: string;
    /**
     * Entity Scope the primary location of the resource
     * Organization, or organization Unit or Internal/External
     * Could be ID or ASEID
     *
     */
    scope: number | string;
    /**
     * Entity Type the type of the resource
     */
    entity: string;
    /**
     * Entity ID the unique identifier of the resource
     */
    id: number | string;
    /**
     * Version of the entity (optional)
     */
    version?: string;
    /**
     * Shard of the entity (optional)
     */
    shard?: string;
}
export interface A_TYPES__ASEID_ConstructorConfig {
    /**
     * If true, the entity ASEID will be distributed across multiple shards.
     * In this case SHARD should be provided via Environment Variables (A_SHARD) or Configurations
     *
     */
    sharding?: boolean;
}
export type A_TYPES__ASEID_JSON = {
    /**
     * Concept for the ASEID
     */
    concept: string;
    /**
     * Entity Scope the primary location of the resource
     */
    scope: string;
    /**
     * Entity Type the type of the resource
     */
    entity: string;
    /**
     * Entity ID the unique identifier of the resource
     */
    id: string;
    /**
     * Version of the entity (optional)
     */
    version?: string;
    /**
     * Shard of the entity (optional)
     */
    shard?: string;
};
