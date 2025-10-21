"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_TmpStage = exports.A_StepsManager = void 0;
const A_Stage_class_1 = require("../global/A-Stage/A-Stage.class");
class A_StepsManager {
    constructor(entities) {
        this.entities = this.prepareSteps(entities);
        this.graph = new Map();
        this.visited = new Set();
        this.tempMark = new Set();
        this.sortedEntities = [];
    }
    prepareSteps(entities) {
        return entities.map(step => {
            return Object.assign(Object.assign({}, step), { behavior: step.behavior || 'sync', before: step.before || [], after: step.after || [] });
        });
    }
    ID(step) {
        return `${typeof step.component === 'string' ? step.component : step.component.name}.${step.handler}`;
    }
    buildGraph() {
        // Initialize graph nodes
        this.entities.forEach(entity => this.graph.set(this.ID(entity), new Set()));
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
            .filter(entity => regex.test(this.ID(entity)))
            .map(entity => this.ID(entity));
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
            if (!this.visited.has(this.ID(entity)))
                this.visit(this.ID(entity));
        });
        const stages = [];
        // Map sorted names back to entity objects
        this.sortedEntities
            .map(id => {
            const step = this.entities.find(entity => this.ID(entity) === id);
            let stage = stages.find(stage => {
                return stage.after.every(after => step.after.includes(after))
                    && step.before.every(before => stage.after.includes(before));
            });
            if (!stage) {
                stage = new A_TmpStage();
                stages.push(stage);
            }
            stage.add(step);
        });
        return stages.map(stage => new A_Stage_class_1.A_Stage(feature, stage.steps));
    }
}
exports.A_StepsManager = A_StepsManager;
class A_TmpStage {
    constructor(_steps = []) {
        this.name = 'A_TmpStage';
        this._steps = _steps;
    }
    get before() {
        return this._steps.reduce((acc, step) => ([
            ...acc,
            ...step.before
        ]), []);
    }
    get after() {
        return this._steps.reduce((acc, step) => ([
            ...acc,
            ...step.after
        ]), []);
    }
    get steps() {
        return this._steps;
    }
    get asyncSteps() {
        return this._steps.filter(step => step.behavior === 'async');
    }
    get syncSteps() {
        return this._steps.filter(step => step.behavior === 'sync');
    }
    /**
     * Adds a step to the stage
     *
     * @param step
     * @returns
     */
    add(step) {
        this._steps.push(step);
        return this;
    }
}
exports.A_TmpStage = A_TmpStage;
//# sourceMappingURL=A_StepsManager.class.js.map