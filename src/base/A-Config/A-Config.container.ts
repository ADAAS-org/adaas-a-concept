import { A_Container } from "@adaas/a-concept/global/A-Container/A-Container.class";
import { ConfigReader } from "./components/ConfigReader.component";
import { A_Logger } from "../A-Logger/A-Logger.component";
import { A_Inject } from "@adaas/a-concept/decorators/A-Inject/A-Inject.decorator";
import { A_Polyfills } from "@adaas/a-utils";
import { A_Context } from "@adaas/a-concept/global/A-Context/A-Context.class";
import { FileConfigReader } from "./components/FileConfigReader.component";
import { ENVConfigReader } from "./components/ENVConfigReader.component";
import { A_Scope } from "@adaas/a-concept/global/A-Scope/A-Scope.class";





export class A_ConfigLoader extends A_Container<['load', 'read']> {

    private reader!: ConfigReader



    async identifyReader(
        @A_Inject(A_Scope) scope: A_Scope,
        @A_Inject(A_Logger) logger: A_Logger
    ) {

        // OR Inject the logger by calling Context Provider
        // const logger2 = await this.CP.resolve(A_LoggerContext);

        const fs = await A_Polyfills.fs();

        switch (true) {

            case A_Context.environment === 'server' && !!fs.existsSync(`${scope.name}.conf.json`):
                this.reader = scope.resolve(FileConfigReader);
                break;


            case A_Context.environment === 'server': !fs.existsSync(`${scope.name}.conf.json`)
                this.reader = scope.resolve(ENVConfigReader);
                break;

            case A_Context.environment === 'browser':
                this.reader = scope.resolve(ENVConfigReader);
                break;

            default:
                throw new Error(`Environment ${A_Context.environment} is not supported`);
        }
    }

    async readVariables() {
        // const config = await this.reader.read(this.namespace.CONFIG_PROPERTIES);


    }

}



const foo = new A_ConfigLoader({});