"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_StepsManager = void 0;
const A_Stage_class_1 = require("../A-Stage/A-Stage.class");
const A_StepManager_error_1 = require("./A-StepManager.error");
class A_StepsManager {
    constructor(entities) {
        this._isBuilt = false;
        this.entities = this.prepareSteps(entities);
        this.graph = new Map();
        this.visited = new Set();
        this.tempMark = new Set();
        this.sortedEntities = [];
    }
    prepareSteps(entities) {
        return entities
            .map(step => (Object.assign(Object.assign({}, step), { behavior: step.behavior || 'sync', before: step.before || '', after: step.after || '', override: step.override || '', throwOnError: false })));
    }
    ID(step) {
        return `${typeof step.component === 'string' ? step.component : step.component.name}.${step.handler}`;
    }
    buildGraph() {
        if (this._isBuilt)
            return;
        this._isBuilt = true;
        // Filter override
        this.entities = this.entities
            .filter((step, i, self) => !self.some(s => s.override ? new RegExp(s.override).test(this.ID(step)) : false));
        // Initialize graph nodes
        this.entities.forEach(entity => this.graph.set(this.ID(entity), new Set()));
        // Add directed edges based on 'before' and 'after'
        this.entities.forEach(entity => {
            const entityId = this.ID(entity);
            // Add edges for 'before' dependencies
            // If entity should execute before targets, then targets depend on entity
            // So we add edges: target -> entity (target depends on entity)
            if (entity.before) {
                const targets = this.matchEntities(entityId, entity.before);
                targets.forEach(target => {
                    if (!this.graph.has(target))
                        this.graph.set(target, new Set());
                    this.graph.get(target).add(entityId); // target depends on entity
                });
            }
            // Add edges for 'after' dependencies  
            // If entity should execute after sources, then entity depends on sources
            // So we add edges: entity -> source (entity depends on source)
            if (entity.after) {
                const sources = this.matchEntities(entityId, entity.after);
                sources.forEach(source => {
                    if (!this.graph.has(entityId))
                        this.graph.set(entityId, new Set());
                    this.graph.get(entityId).add(source); // entity depends on source
                });
            }
        });
    }
    // Match entities by name or regex
    matchEntities(entityId, pattern) {
        const regex = new RegExp(pattern);
        return this.entities
            .filter(entity => regex.test(this.ID(entity)) && this.ID(entity) !== entityId)
            .map(entity => this.ID(entity));
    }
    // Topological sort with cycle detection
    visit(node) {
        if (this.tempMark.has(node)) {
            return;
            // TODO: maybe we have to keep this error but only for partial cases
            throw new A_StepManager_error_1.A_StepManagerError(A_StepManager_error_1.A_StepManagerError.CircularDependencyError, `Circular dependency detected involving step: ${node}. Make sure that your 'before' and 'after' dependencies do not create cycles.`);
        }
        if (!this.visited.has(node)) {
            this.tempMark.add(node);
            (this.graph.get(node) || []).forEach(neighbor => this.visit(neighbor));
            this.tempMark.delete(node);
            this.visited.add(node);
            this.sortedEntities.push(node);
            // // Visit neighbors in stable order (preserving original order)
            // const neighbors = Array.from(this.graph.get(node) || []);
            // // neighbors.sort((a, b) => {
            // //     const orderA = this.originalOrder.get(a) || 0;
            // //     const orderB = this.originalOrder.get(b) || 0;
            // //     return orderA - orderB;
            // // });
            // neighbors.forEach(neighbor => this.visit(neighbor));
            // this.tempMark.delete(node);
            // this.visited.add(node);
            // this.sortedEntities.push(node);
        }
    }
    toSortedArray() {
        this.buildGraph();
        // Start topological sort
        this.entities.forEach(entity => {
            if (!this.visited.has(this.ID(entity)))
                this.visit(this.ID(entity));
        });
        return this.sortedEntities;
    }
    // Sort the entities based on dependencies
    toStages(feature) {
        const sortedNames = this.toSortedArray();
        // Map sorted names back to entity objects
        return sortedNames
            .map(id => {
            const step = this.entities.find(entity => this.ID(entity) === id);
            return new A_Stage_class_1.A_Stage(feature, step);
        });
    }
}
exports.A_StepsManager = A_StepsManager;
//# sourceMappingURL=A-StepManager.class.js.map