
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
            .trim()
            .replace(/([a-z])([A-Z])/g, '$1_$2')  // Handle camelCase
            .replace(/[^a-zA-Z0-9]+/g, '_')       // Replace non-alphanumeric with underscores
            .replace(/_+/g, '_')                  // Collapse multiple underscores
            .replace(/^_|_$/g, '')                // Remove leading/trailing underscores
            .toUpperCase();
    }
    /**
     * Convert string to camelCase
     * 
     * @param str 
     * @returns 
     */
    static toCamelCase(str: string): string {
        return str
            .trim()
            .replace(/[^a-zA-Z0-9]+/g, ' ')       // Replace non-alphanumeric with spaces
            .split(' ')                           // Split by spaces
            .filter(Boolean)                      // Remove empty items
            .map((part, index) => {
                if (index === 0) {
                    return part.toLowerCase();
                }
                return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
            })
            .join('');
    }
    /**
     * Convert string to PascalCase
     * 
     * @param str 
     * @returns 
     */
    static toPascalCase(str: string): string {
        return str
            .trim()
            .replace(/([a-z])([A-Z])/g, '$1 $2')  // Insert space before uppercase in camelCase
            .replace(/[^a-zA-Z0-9]+/g, ' ')       // Replace non-alphanumeric with spaces
            .split(' ')                           // Split by spaces
            .filter(Boolean)                      // Remove empty items
            .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
            .join('');
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