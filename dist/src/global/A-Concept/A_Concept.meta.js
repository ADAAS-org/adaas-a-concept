"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_ConceptMeta = void 0;
const A_Meta_class_1 = require("../A-Meta/A-Meta.class");
const A_Context_class_1 = require("../A-Context/A-Context.class");
const A_Abstraction_class_1 = require("../A-Abstraction/A-Abstraction.class");
// import { A_TYPES__ComponentMeta } from "./A-Component.types";
class A_ConceptMeta extends A_Meta_class_1.A_Meta {
    constructor(containers, base) {
        super();
        this.containers = containers;
        this.base = base;
    }
    abstractionDefinition(method, scope) {
        const featureDefinitions = this.containers.map(container => A_Context_class_1.A_Context.abstractionDefinition(container, method, scope));
        const definition = {
            name: `${this.base.name}.${method}`,
            features: featureDefinitions,
            scope
        };
        return definition;
    }
    abstraction(method, scope) {
        const featureDefinitions = this.containers.map(container => {
            const definition = A_Context_class_1.A_Context.abstractionDefinition(container, method, container.Scope);
            return Object.assign(Object.assign({}, definition), { steps: definition.steps.map(step => (Object.assign(Object.assign({}, step), { component: step.component ? step.component : container }))) });
        });
        const definition = {
            name: `${this.base.name}.${method}`,
            features: featureDefinitions,
            scope
        };
        return new A_Abstraction_class_1.A_Abstraction(definition);
    }
}
exports.A_ConceptMeta = A_ConceptMeta;
//# sourceMappingURL=A_Concept.meta.js.map