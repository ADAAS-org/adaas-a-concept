import { A_Module } from "@adaas/a-concept/global/A_Module.class";
import { A_TYPES__ModuleConstructor } from "../../../src/types/A_Module.types";
import { Server } from 'http';
import { SimpleHTTPServerModuleControllers } from "./simple-http-server.types";
declare module "@adaas/a-concept/global/A-Concept/A_Concept.class" {
    interface A_Concept {
        server: any;
    }
}
export type SimpleServerModuleConfig = {
    port: number;
} & A_TYPES__ModuleConstructor;
export declare class SimpleHTTPServerModule extends A_Module<SimpleServerModuleConfig> {
    server: Server;
    controllers: SimpleHTTPServerModuleControllers;
}
