import { A_Component } from "@adaas/a-concept/global/A-Component/A-Component.class";
import { A_Namespace } from "@adaas/a-concept/global/A-Namespace/A_Namespace.class";
import { A_Error } from "@adaas/a-utils";
import { A_Config } from "src/containers/A-Config/A-Config.namespace";


export class Logger extends A_Component {

    constructor(
        protected namespace: A_Namespace,
        protected config: A_Config
    ) {
        super(namespace);
    }

    readonly colors = {
        green: '32',
        blue: '34',
        red: '31',
        yellow: '33',
        gray: '90',
        magenta: '35',
        cyan: '36',
        white: '37',
        pink: '95',
    } as const


    get namespaceLength() {
        return this.namespaceLength;
    }


    compile(
        color: keyof typeof this.colors,
        ...args: any[]
    ): Array<string> {

        return [
            `\x1b[${this.colors[color]}m[${this.namespace}] |${this.getTime()}|`,
            (
                args.length > 1
                    ? '\n' + `${' '.repeat(this.namespaceLength + 3)}|-------------------------------`
                    : ''

            ),
            ...(args
                .map((arg, i) => {


                    switch (true) {
                        case arg instanceof A_Error:
                            return this.compile_A_Error(arg);

                        case arg instanceof Error:
                            return this.compile_Error(arg);

                        case typeof arg === 'object':
                            return JSON.stringify(arg, null, 2)
                                .replace(/\n/g, '\n' + `${' '.repeat(this.namespaceLength + 3)}| `);

                        default:
                            return String(
                                ((i > 0 || args.length > 1) ? '\n' : '')
                                + arg)
                                .replace(/\n/g, '\n' + `${' '.repeat(this.namespaceLength + 3)}| `)
                    }
                })),
            (
                args.length > 1
                    ? '\n' + `${' '.repeat(this.namespaceLength + 3)}|-------------------------------\x1b[0m`
                    : '\x1b[0m'
            )
        ]
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


    protected log_A_Error(error: A_Error) {
        const time = this.getTime();

        console.log(`\x1b[31m[${this.namespace}] |${time}| ERROR ${error.code}
${' '.repeat(this.namespaceLength + 3)}| ${error.message}
${' '.repeat(this.namespaceLength + 3)}| ${error.description} 
${' '.repeat(this.namespaceLength + 3)}|-------------------------------
${' '.repeat(this.namespaceLength + 3)}| ${error.stack?.split('\n').map((line, index) => index === 0 ? line : `${' '.repeat(this.namespaceLength + 3)}| ${line}`).join('\n') || 'No stack trace'}
${' '.repeat(this.namespaceLength + 3)}|-------------------------------
\x1b[0m`
            + (error.originalError ? `\x1b[31m${' '.repeat(this.namespaceLength + 3)}| Wrapped From  ${error.originalError.message}
${' '.repeat(this.namespaceLength + 3)}|-------------------------------
${' '.repeat(this.namespaceLength + 3)}| ${error.originalError.stack?.split('\n').map((line, index) => index === 0 ? line : `${' '.repeat(this.namespaceLength + 3)}| ${line}`).join('\n') || 'No stack trace'}
${' '.repeat(this.namespaceLength + 3)}|-------------------------------
\x1b[0m`: '')
            + (error.link ? `\x1b[31m${' '.repeat(this.namespaceLength + 3)}| Read in docs: ${error.link}
${' '.repeat(this.namespaceLength + 3)}|-------------------------------
\x1b[0m`: ''));

    }

    protected compile_A_Error(error: A_Error): string {
        const time = this.getTime();

        return '\n' +

            `${' '.repeat(this.namespaceLength + 3)}|-------------------------------` +
            '\n' +
            `${' '.repeat(this.namespaceLength + 3)}|  Error:  | ${error.code}
${' '.repeat(this.namespaceLength + 3)}|-------------------------------
${' '.repeat(this.namespaceLength + 3)}|${' '.repeat(10)}| ${error.message}
${' '.repeat(this.namespaceLength + 3)}|${' '.repeat(10)}| ${error.description} 
${' '.repeat(this.namespaceLength + 3)}|-------------------------------
${' '.repeat(this.namespaceLength + 3)}| ${error.stack?.split('\n').map((line, index) => index === 0 ? line : `${' '.repeat(this.namespaceLength + 3)}| ${line}`).join('\n') || 'No stack trace'}
${' '.repeat(this.namespaceLength + 3)}|-------------------------------`
            +
            (error.originalError ? `${' '.repeat(this.namespaceLength + 3)}| Wrapped From  ${error.originalError.message}
${' '.repeat(this.namespaceLength + 3)}|-------------------------------
${' '.repeat(this.namespaceLength + 3)}| ${error.originalError.stack?.split('\n').map((line, index) => index === 0 ? line : `${' '.repeat(this.namespaceLength + 3)}| ${line}`).join('\n') || 'No stack trace'}
${' '.repeat(this.namespaceLength + 3)}|-------------------------------` : '')
            +
            (error.link ? `${' '.repeat(this.namespaceLength + 3)}| Read in docs: ${error.link}
${' '.repeat(this.namespaceLength + 3)}|-------------------------------` : '');

    }


    protected compile_Error(error: Error): string {
        return JSON.stringify({
            name: error.name,
            message: error.message,
            stack: error.stack?.split('\n')
                .map((line, index) => index === 0 ? line : `${' '.repeat(this.namespaceLength + 3)}| ${line}`)
                .join('\n')

        }, null, 2)
            .replace(/\n/g, '\n' + `${' '.repeat(this.namespaceLength + 3)}| `)
            .replace(/\\n/g, '\n')
    }



    protected getTime() {
        const now = new Date();
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const milliseconds = String(now.getMilliseconds()).padStart(4, '0');
        return `${minutes}:${seconds}:${milliseconds}`;
    }
}