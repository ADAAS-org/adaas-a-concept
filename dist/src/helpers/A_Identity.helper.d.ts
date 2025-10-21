export type A_ID_TYPES__TimeId_Parts = {
    timestamp: Date;
    random: string;
};
export declare class A_IdentityHelper {
    /**
   * Generates a short, time-based unique ID.
   * Encodes current time (ms since epoch) and random bits in base36.
   * Example: "mb4f1g-7f9a1c"
   */
    static generateTimeId(parts?: A_ID_TYPES__TimeId_Parts): string;
    /**
     * Parses a short ID back into its parts.
     * Returns an object with the original timestamp (as Date) and random string.
     */
    static parseTimeId(id: string): A_ID_TYPES__TimeId_Parts;
    /**
     *  Format a number with leading zeros to a fixed length
     *
     * @param number
     * @param maxZeros
     * @returns
     */
    static formatWithLeadingZeros(number: any, maxZeros?: number): string;
    /**
     * Remove leading zeros from a formatted number
     */
    static removeLeadingZeros(formattedNumber: any): string;
}
