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
const A_Concept_class_1 = require("../../src/global/A-Concept/A_Concept.class");
const Main_container_1 = require("./containers/Main.container");
const A_component_1 = require("./components/A.component");
const B_component_1 = require("./components/B.component");
const A_Config_context_1 = require("../../src/base/A-Config/A-Config.context");
const A_Errors_context_1 = require("../../src/base/A-Errors/A-Errors.context");
const A_Container_class_1 = require("../../src/global/A-Container/A-Container.class");
(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Start');
    class foo extends A_Container_class_1.A_Container {
    }
    const simpleConcept = new A_Concept_class_1.A_Concept({
        name: 'simple-concept',
        fragments: [
            new A_Config_context_1.A_Config({
                variables: ['A', 'B', 'C'],
                defaults: {
                    A: 1,
                }
            }),
            new A_Errors_context_1.A_Errors({
                errors: [
                    {
                        code: 'some_error',
                        description: 'Error 1',
                        message: 'Error 1'
                    }
                ]
            })
        ],
        containers: [
            new Main_container_1.MainContainer({
                components: [
                    A_component_1.ComponentA,
                    B_component_1.ComponentB
                ]
            }),
            new foo({})
        ]
    });
    yield simpleConcept.run({});
    simpleConcept.call('method_B');
}))();
//# sourceMappingURL=concept.js.map