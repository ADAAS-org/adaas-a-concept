/**
 * A_FormatterHelper
 *
 * Helper class for formatting strings into different cases.
 */
export declare class A_FormatterHelper {
    /**
     * Convert string to UPPER_SNAKE_CASE
     *
     * @param str
     * @returns
     */
    static toUpperSnakeCase(str: string): string;
    /**
     * Convert string to camelCase
     *
     * @param str
     * @returns
     */
    static toCamelCase(str: string): string;
    /**
     * Convert string to PascalCase
     *
     * @param str
     * @returns
     */
    static toPascalCase(str: string): string;
    /**
     * Convert string to kebab-case
     *
     * @param str
     * @returns
     */
    static toKebabCase(str: string): string;
}
