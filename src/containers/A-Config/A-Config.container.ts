import { A_Container } from "@adaas/a-concept/global/A-Container/A-Container.class";
import { A_Config } from "./A-Config.namespace";
import { A_Load } from "@adaas/a-concept/decorators/A-ConceptLifecycle/A-Load/A-Load.decorator";
import { A_Polyfills } from "@adaas/a-utils";
import { FileConfigReader } from "./components/FileConfigReader.component";
import { ENVConfigReader } from "./components/ENVConfigReader.component";
import { ConfigReader } from "./components/ConfigReader.component";
import { A_Context } from "@adaas/a-concept/global/A-Context/A-Context.class";



// @A_Injectable({

// })
export class A_ConfigInitializer extends A_Container<A_Config> {

    private reader!: ConfigReader


    @A_Load({
    })
    async identifyReader(
        // @A_Inject(A_LoggerContext) logger: A_LoggerContext
    ) {

        // OR Inject the logger by calling Context Provider
        // const logger2 = await this.CP.resolve(A_LoggerContext);

        const fs = await A_Polyfills.fs();

        switch (true) {

            case A_Context.environment === 'server' && !!fs.existsSync(`${this.namespace}.conf.json`):
                this.reader = A_Context.resolve(FileConfigReader);
                break;


            case A_Context.environment === 'server': !fs.existsSync(`${this.namespace}.conf.json`)
                this.reader = A_Context.resolve(ENVConfigReader);
                break;

            case A_Context.environment === 'browser':
                this.reader = A_Context.resolve(ENVConfigReader);
                break;

            default:
                throw new Error(`Environment ${A_Context.environment} is not supported`);
        }
    }


    @A_Load({})
    async readVariables() {
        const config = await this.reader.read(this.namespace.CONFIG_PROPERTIES);

        this.namespace.set(config);
    }


}
