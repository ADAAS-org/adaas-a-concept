import { A_Container } from "@adaas/a-concept/global/A-Container/A-Container.class";
import { ConfigReader } from "./components/ConfigReader.component";
import { A_Inject } from "@adaas/a-concept/decorators/A-Inject/A-Inject.decorator";
import { A_Polyfills } from "@adaas/a-utils";
import { A_Context } from "@adaas/a-concept/global/A-Context/A-Context.class";
import { FileConfigReader } from "./components/FileConfigReader.component";
import { ENVConfigReader } from "./components/ENVConfigReader.component";
import { A_Scope } from "@adaas/a-concept/global/A-Scope/A-Scope.class";
import { A_Concept } from "@adaas/a-concept/global/A-Concept/A_Concept.class";
import { A_Config } from "./A-Config.context";
import { A_TYPES__ContainerConstructor } from "@adaas/a-concept/global/A-Container/A-Container.types";


export class A_ConfigLoader extends A_Container {

    private reader!: ConfigReader


    constructor(params:Partial<A_TYPES__ContainerConstructor<['load', 'read']>>) {
        super({
            ...params,
            name:params.name || 'a-config-loader'
        });
    }


    @A_Concept.Load()
    async prepare(
        @A_Inject(A_Config) config: A_Config,
    ) {
        const fs = await A_Polyfills.fs();

        switch (true) {

            case A_Context.environment === 'server' && !!fs.existsSync(`${A_Context.root.name}.conf.json`):
                this.reader = this.Scope.resolve(FileConfigReader);
                break;

            case A_Context.environment === 'server': !fs.existsSync(`${A_Context.root.name}.conf.json`)
                this.reader = this.Scope.resolve(ENVConfigReader);
                break;

            case A_Context.environment === 'browser':
                this.reader = this.Scope.resolve(ENVConfigReader);
                break;

            default:
                throw new Error(`Environment ${A_Context.environment} is not supported`);
        }

    }



    @A_Concept.Load()
    async readVariables(
        @A_Inject(A_Config) config: A_Config,
    ) {
        await this.reader.inject(config);
    }

}





const foo = new A_ConfigLoader({});