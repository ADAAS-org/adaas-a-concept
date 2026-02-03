import { A_Feature } from "../A-Feature/A-Feature.class";
import { A_TYPES__FeatureDefineDecoratorTemplateItem } from "../A-Feature/A-Feature.types";
import { A_Stage } from "../A-Stage/A-Stage.class";
import { A_TYPES__A_StageStep } from "../A-Stage/A-Stage.types";
import { A_StepManagerError } from "./A-StepManager.error";

export class A_StepsManager {

    public entities: A_TYPES__A_StageStep[];
    public graph: Map<string, Set<string>>;
    public visited: Set<string>;
    public tempMark: Set<string>;
    public sortedEntities: string[];


    private _isBuilt: boolean = false;

    constructor(entities: Array<A_TYPES__FeatureDefineDecoratorTemplateItem>) {
        this.entities = this.prepareSteps(entities);

        this.graph = new Map();
        this.visited = new Set();
        this.tempMark = new Set();
        this.sortedEntities = [];

    }

    private prepareSteps(
        entities: Array<A_TYPES__FeatureDefineDecoratorTemplateItem>
    ): Array<A_TYPES__A_StageStep> {
        return entities
            .map(step => ({
                ...step,

                behavior: step.behavior || 'sync',
                before: step.before || '',
                after: step.after || '',
                override: step.override || '',
                throwOnError: false
            }));
    }

    private ID(step: A_TYPES__A_StageStep) {
        return `${step.dependency.name}.${step.handler}`;
    }

    private buildGraph() {
        if (this._isBuilt) return;
        this._isBuilt = true;

        // Filter override
        this.entities = this.entities
            .filter((step, i, self) =>
                !self.some(s => s.override ? new RegExp(s.override).test(this.ID(step)) : false)
            );

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
                    if (!this.graph.has(target)) this.graph.set(target, new Set());
                    this.graph.get(target)!.add(entityId); // target depends on entity
                });
            }

            // Add edges for 'after' dependencies  
            // If entity should execute after sources, then entity depends on sources
            // So we add edges: entity -> source (entity depends on source)
            if (entity.after) {
                const sources = this.matchEntities(entityId, entity.after);

                sources.forEach(source => {
                    if (!this.graph.has(entityId)) this.graph.set(entityId, new Set());
                    this.graph.get(entityId)!.add(source); // entity depends on source
                });
            }
        });
    }

    // Match entities by name or regex
    private matchEntities(entityId: string, pattern: string): string[] {
        const regex = new RegExp(pattern);

        return this.entities
            .filter(entity => regex.test(this.ID(entity)) && this.ID(entity) !== entityId)
            .map(entity => this.ID(entity));
    }

    // Topological sort with cycle detection
    private visit(node: string): void {
        if (this.tempMark.has(node)) {
            return;
            // TODO: maybe we have to keep this error but only for partial cases
            throw new A_StepManagerError(
                A_StepManagerError.CircularDependencyError,
                `Circular dependency detected involving step: ${node}. Make sure that your 'before' and 'after' dependencies do not create cycles.`
            );
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


    toSortedArray(): Array<string> {
        this.buildGraph();

        // Start topological sort
        this.entities.forEach(entity => {
            if (!this.visited.has(this.ID(entity))) this.visit(this.ID(entity));
        });

        return this.sortedEntities;
    }

    // Sort the entities based on dependencies
    toStages(feature: A_Feature): Array<A_Stage> {


        const sortedNames = this.toSortedArray();


        // Map sorted names back to entity objects
        return sortedNames
            .map(id => {
                const step = this.entities.find(entity => this.ID(entity) === id)!;


                return new A_Stage(feature, step);
            });
    }
}


