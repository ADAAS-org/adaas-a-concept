"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const A_Component_class_1 = require("../../../global/A-Component/A-Component.class");
const a_utils_1 = require("@adaas/a-utils");
class Logger extends A_Component_class_1.A_Component {
    constructor(namespace, config) {
        super(namespace);
        this.namespace = namespace;
        this.config = config;
        this.colors = {
            green: '32',
            blue: '34',
            red: '31',
            yellow: '33',
            gray: '90',
            magenta: '35',
            cyan: '36',
            white: '37',
            pink: '95',
        };
    }
    get namespaceLength() {
        return this.namespaceLength;
    }
    compile(color, ...args) {
        return [
            `\x1b[${this.colors[color]}m[${this.namespace}] |${this.getTime()}|`,
            (args.length > 1
                ? '\n' + `${' '.repeat(this.namespaceLength + 3)}|-------------------------------`
                : ''),
            ...(args
                .map((arg, i) => {
                switch (true) {
                    case arg instanceof a_utils_1.A_Error:
                        return this.compile_A_Error(arg);
                    case arg instanceof Error:
                        return this.compile_Error(arg);
                    case typeof arg === 'object':
                        return JSON.stringify(arg, null, 2)
                            .replace(/\n/g, '\n' + `${' '.repeat(this.namespaceLength + 3)}| `);
                    default:
                        return String(((i > 0 || args.length > 1) ? '\n' : '')
                            + arg)
                            .replace(/\n/g, '\n' + `${' '.repeat(this.namespaceLength + 3)}| `);
                }
            })),
            (args.length > 1
                ? '\n' + `${' '.repeat(this.namespaceLength + 3)}|-------------------------------\x1b[0m`
                : '\x1b[0m')
        ];
    }
    log(...args) {
        if (!this.config.get('CONFIG_VERBOSE'))
            return;
        console.log(...this.compile('blue', ...args));
    }
    warning(...args) {
        if (!this.config.get('CONFIG_VERBOSE'))
            return;
        console.log(...this.compile('yellow', ...args));
    }
    error(...args) {
        if (this.config.get('CONFIG_IGNORE_ERRORS'))
            return;
        return console.log(...this.compile('red', ...args));
    }
    log_A_Error(error) {
        var _a, _b;
        const time = this.getTime();
        console.log(`\x1b[31m[${this.namespace}] |${time}| ERROR ${error.code}
${' '.repeat(this.namespaceLength + 3)}| ${error.message}
${' '.repeat(this.namespaceLength + 3)}| ${error.description} 
${' '.repeat(this.namespaceLength + 3)}|-------------------------------
${' '.repeat(this.namespaceLength + 3)}| ${((_a = error.stack) === null || _a === void 0 ? void 0 : _a.split('\n').map((line, index) => index === 0 ? line : `${' '.repeat(this.namespaceLength + 3)}| ${line}`).join('\n')) || 'No stack trace'}
${' '.repeat(this.namespaceLength + 3)}|-------------------------------
\x1b[0m`
            + (error.originalError ? `\x1b[31m${' '.repeat(this.namespaceLength + 3)}| Wrapped From  ${error.originalError.message}
${' '.repeat(this.namespaceLength + 3)}|-------------------------------
${' '.repeat(this.namespaceLength + 3)}| ${((_b = error.originalError.stack) === null || _b === void 0 ? void 0 : _b.split('\n').map((line, index) => index === 0 ? line : `${' '.repeat(this.namespaceLength + 3)}| ${line}`).join('\n')) || 'No stack trace'}
${' '.repeat(this.namespaceLength + 3)}|-------------------------------
\x1b[0m` : '')
            + (error.link ? `\x1b[31m${' '.repeat(this.namespaceLength + 3)}| Read in docs: ${error.link}
${' '.repeat(this.namespaceLength + 3)}|-------------------------------
\x1b[0m` : ''));
    }
    compile_A_Error(error) {
        var _a, _b;
        const time = this.getTime();
        return '\n' +
            `${' '.repeat(this.namespaceLength + 3)}|-------------------------------` +
            '\n' +
            `${' '.repeat(this.namespaceLength + 3)}|  Error:  | ${error.code}
${' '.repeat(this.namespaceLength + 3)}|-------------------------------
${' '.repeat(this.namespaceLength + 3)}|${' '.repeat(10)}| ${error.message}
${' '.repeat(this.namespaceLength + 3)}|${' '.repeat(10)}| ${error.description} 
${' '.repeat(this.namespaceLength + 3)}|-------------------------------
${' '.repeat(this.namespaceLength + 3)}| ${((_a = error.stack) === null || _a === void 0 ? void 0 : _a.split('\n').map((line, index) => index === 0 ? line : `${' '.repeat(this.namespaceLength + 3)}| ${line}`).join('\n')) || 'No stack trace'}
${' '.repeat(this.namespaceLength + 3)}|-------------------------------`
            +
                (error.originalError ? `${' '.repeat(this.namespaceLength + 3)}| Wrapped From  ${error.originalError.message}
${' '.repeat(this.namespaceLength + 3)}|-------------------------------
${' '.repeat(this.namespaceLength + 3)}| ${((_b = error.originalError.stack) === null || _b === void 0 ? void 0 : _b.split('\n').map((line, index) => index === 0 ? line : `${' '.repeat(this.namespaceLength + 3)}| ${line}`).join('\n')) || 'No stack trace'}
${' '.repeat(this.namespaceLength + 3)}|-------------------------------` : '')
            +
                (error.link ? `${' '.repeat(this.namespaceLength + 3)}| Read in docs: ${error.link}
${' '.repeat(this.namespaceLength + 3)}|-------------------------------` : '');
    }
    compile_Error(error) {
        var _a;
        return JSON.stringify({
            name: error.name,
            message: error.message,
            stack: (_a = error.stack) === null || _a === void 0 ? void 0 : _a.split('\n').map((line, index) => index === 0 ? line : `${' '.repeat(this.namespaceLength + 3)}| ${line}`).join('\n')
        }, null, 2)
            .replace(/\n/g, '\n' + `${' '.repeat(this.namespaceLength + 3)}| `)
            .replace(/\\n/g, '\n');
    }
    getTime() {
        const now = new Date();
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const milliseconds = String(now.getMilliseconds()).padStart(4, '0');
        return `${minutes}:${seconds}:${milliseconds}`;
    }
}
exports.Logger = Logger;
//# sourceMappingURL=Logger.component.js.map