"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_IdentityHelper = void 0;
class A_IdentityHelper {
    /**
   * Generates a short, time-based unique ID.
   * Encodes current time (ms since epoch) and random bits in base36.
   * Example: "mb4f1g-7f9a1c"
   */
    static generateTimeId(parts = { timestamp: new Date(), random: Math.random().toString(36).slice(2, 8) }) {
        const time = parts.timestamp.getTime().toString(36); // base36-encoded timestamp
        const random = parts.random; // use provided random string
        return `${time}-${random}`;
    }
    /**
     * Parses a short ID back into its parts.
     * Returns an object with the original timestamp (as Date) and random string.
     */
    static parseTimeId(id) {
        const [timePart, randomPart] = id.split('-');
        const timestamp = new Date(parseInt(timePart, 36));
        return { timestamp, random: randomPart };
    }
    /**
     *  Format a number with leading zeros to a fixed length
     *
     * @param number
     * @param maxZeros
     * @returns
     */
    static formatWithLeadingZeros(number, maxZeros = 10) {
        const formattedNumber = String(number).padStart(maxZeros + 1, '0');
        return formattedNumber.slice(-maxZeros);
    }
    /**
     * Remove leading zeros from a formatted number
     */
    static removeLeadingZeros(formattedNumber) {
        return String(Number(formattedNumber)); // Convert to number and back to string to remove leading zeros
    }
}
exports.A_IdentityHelper = A_IdentityHelper;
//# sourceMappingURL=A_Identity.helper.js.map