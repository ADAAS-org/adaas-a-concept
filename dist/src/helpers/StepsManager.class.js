"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StepsManager = void 0;
const A_Stage_class_1 = require("../global/A-Stage/A-Stage.class");
class StepsManager {
    constructor(entities) {
        this.entities = entities;
        this.graph = new Map();
        this.visited = new Set();
        this.tempMark = new Set();
        this.sortedEntities = [];
    }
    buildGraph() {
        // Initialize graph nodes
        this.entities.forEach(entity => this.graph.set(entity.name, new Set()));
        // Add directed edges based on 'before' and 'after'
        this.entities.forEach(entity => {
            const { name, before = [], after = [] } = entity;
            // Add edges for 'before' dependencies
            before.forEach(dep => {
                const targets = this.matchEntities(dep);
                targets.forEach(target => {
                    if (!this.graph.has(target))
                        this.graph.set(target, new Set());
                    this.graph.get(target).add(name); // target -> name (target should be before name)
                });
            });
            // Add edges for 'after' dependencies
            after.forEach(dep => {
                const sources = this.matchEntities(dep);
                sources.forEach(source => {
                    if (!this.graph.has(name))
                        this.graph.set(name, new Set());
                    this.graph.get(name).add(source); // name -> source (name should be before source)
                });
            });
        });
    }
    // Match entities by name or regex
    matchEntities(pattern) {
        const regex = new RegExp(`^${pattern}$`);
        return this.entities
            .filter(entity => regex.test(entity.name))
            .map(entity => entity.name);
    }
    // Topological sort with cycle detection
    visit(node) {
        if (this.tempMark.has(node))
            throw new Error("Circular dependency detected");
        if (!this.visited.has(node)) {
            this.tempMark.add(node);
            (this.graph.get(node) || []).forEach(neighbor => this.visit(neighbor));
            this.tempMark.delete(node);
            this.visited.add(node);
            this.sortedEntities.push(node);
        }
    }
    // Sort the entities based on dependencies
    toStages(feature) {
        this.buildGraph();
        // Start topological sort
        this.entities.forEach(entity => {
            if (!this.visited.has(entity.name))
                this.visit(entity.name);
        });
        const stages = [];
        // Map sorted names back to entity objects
        this.sortedEntities
            .map(name => {
            const step = this.entities.find(entity => entity.name === name);
            let stage = stages.find(stage => {
                return stage.after.every(after => step.after.includes(after))
                    && step.before.every(before => stage.after.includes(before));
            });
            if (!stage) {
                stage = new A_Stage_class_1.A_Stage(feature);
                stages.push(stage);
            }
            stage.add(step);
        });
        return stages;
    }
}
exports.StepsManager = StepsManager;
//# sourceMappingURL=StepsManager.class.js.map