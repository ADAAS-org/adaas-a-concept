
/**
 * A_FormatterHelper
 * 
 * Helper class for formatting strings into different cases.
 */
export class A_FormatterHelper {
    /**
     * Convert string to UPPER_SNAKE_CASE
     * 
     * @param str 
     * @returns 
     */
    static toUpperSnakeCase(str: string): string {
        return str
            .replace(/([a-z])([A-Z])/g, '$1_$2')  // Handle lowercase followed by uppercase
            .replace(/[-\s]([A-Z])/g, '_$1')      // Handle non-alphabetical followed by uppercase
            .replace(/-/g, '_')
            .toUpperCase();
    }
    /**
     * Convert string to camelCase
     * 
     * @param str 
     * @returns 
     */
    static toCamelCase(str: string): string {
        return str.toLowerCase().replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
    }
    /**
     * Convert string to PascalCase
     * 
     * @param str 
     * @returns 
     */
    static toPascalCase(str: string): string {
        const camelCase = this.toCamelCase(str);
        return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
    }
    /**
     * Convert string to kebab-case
     * 
     * @param str 
     * @returns 
     */
    static toKebabCase(str: string): string {
        return str
            // 1. Replace all non-alphanumeric (underscore, dot, etc.) with a space
            .replace(/[^a-zA-Z0-9]+/g, ' ')
            // 2. Insert space before any uppercase preceded by lowercase or digit
            .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
            // 3. Trim spaces at both ends and replace remaining spaces with dashes
            .trim()
            .replace(/\s+/g, '-')
            // 4. Lowercase everything
            .toLowerCase();
    }
}