"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Main_container_1 = require("./containers/Main.container");
const A_component_1 = require("./components/A.component");
const B_component_1 = require("./components/B.component");
const A_Logger_component_1 = require("../../src/base/A-Logger/A-Logger.component");
const Fragment_A_context_1 = require("./context/Fragment_A.context");
const Fragment_B_context_1 = require("./context/Fragment_B.context");
const A_Config_context_1 = require("../../src/base/A-Config/A-Config.context");
const A_Config_container_1 = require("../../src/base/A-Config/A-Config.container");
const ENVConfigReader_component_1 = require("../../src/base/A-Config/components/ENVConfigReader.component");
(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Start');
    // class foo extends A_Container<['f', 'f2']> {
    // }
    // const simpleConcept = new A_Concept({
    //     name: 'simple-concept',
    //     fragments: [
    //         new A_Config({
    //             variables: ['A', 'B', 'C'],
    //             defaults: {
    //                 A: 1,
    //             }
    //         }),
    //         new A_Errors({
    //             errors: [
    //                 {
    //                     code: 'some_error',
    //                     description: 'Error 1',
    //                     message: 'Error 1'
    //                 }
    //             ]
    //         })
    //     ],
    //     containers: [
    //         new foo({})
    //     ]
    // });
    // console.log('Here')
    // simpleConcept.call('method_B');
    const configContext = new A_Config_context_1.A_Config({
        variables: ['CONFIG_VERBOSE'],
        defaults: {
            'CONFIG_VERBOSE': true
        }
    });
    const configLoader = new A_Config_container_1.A_ConfigLoader({
        fragments: [
            configContext
        ],
        components: [
            ENVConfigReader_component_1.ENVConfigReader
        ]
    });
    yield configLoader.identifyReader();
    yield configLoader.readVariables();
    const container = new Main_container_1.MainContainer({
        name: 'MainContainer',
        components: [
            A_Logger_component_1.A_Logger,
            A_component_1.ComponentA,
            B_component_1.ComponentB
        ],
        fragments: [
            configContext,
            new Fragment_A_context_1.ContextFragmentA(),
            new Fragment_B_context_1.ContextFragmentB()
        ]
    });
    // await container.call('method_B');
    yield container.method_B();
}))();
//# sourceMappingURL=concept.js.map