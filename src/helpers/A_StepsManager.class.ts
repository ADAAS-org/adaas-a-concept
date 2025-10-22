import { A_Error } from "../global/A-Error/A_Error.class";
import { A_Feature } from "../global/A-Feature/A-Feature.class";
import { A_TYPES__FeatureDefineDecoratorTemplateItem } from "../global/A-Feature/A-Feature.types";
import { A_Stage } from "../global/A-Stage/A-Stage.class";
import { A_TYPES__A_StageStep } from "../global/A-Stage/A-Stage.types";

export class A_StepsManager {

    public entities: A_TYPES__A_StageStep[];
    public graph: Map<string, Set<string>>;
    public visited: Set<string>;
    public tempMark: Set<string>;
    public sortedEntities: string[];


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
        return entities.map(step => {
            return {
                ...step,
                
                behavior: step.behavior || 'sync',
                before: step.before || [],
                after: step.after || [],
            };
        });
    }

    private ID(step: A_TYPES__A_StageStep) {
        return `${typeof step.component === 'string' ? step.component : step.component.name}.${step.handler}`;
    }

    private buildGraph() {
        // Initialize graph nodes
        this.entities.forEach(entity => this.graph.set(this.ID(entity), new Set()));

        // Add directed edges based on 'before' and 'after'
        this.entities.forEach(entity => {
            const entityId = this.ID(entity);
            const { before = [], after = [] } = entity;

            // Add edges for 'before' dependencies
            // If entity should execute before targets, then targets depend on entity
            // So we add edges: target -> entity (target depends on entity)
            before.forEach(dep => {
                const targets = this.matchEntities(dep);
                targets.forEach(target => {
                    if (!this.graph.has(target)) this.graph.set(target, new Set());
                    this.graph.get(target)!.add(entityId); // target depends on entity
                });
            });

            // Add edges for 'after' dependencies  
            // If entity should execute after sources, then entity depends on sources
            // So we add edges: entity -> source (entity depends on source)
            after.forEach(dep => {
                const sources = this.matchEntities(dep);

                sources.forEach(source => {
                    if (!this.graph.has(entityId)) this.graph.set(entityId, new Set());
                    this.graph.get(entityId)!.add(source); // entity depends on source
                });
            });
        });
    }

    // Match entities by name or regex
    private matchEntities(pattern: string): string[] {
        const regex = new RegExp(`^${pattern}$`);
        return this.entities
            .filter(entity => regex.test(this.ID(entity)))
            .map(entity => this.ID(entity));
    }

    // Topological sort with cycle detection
    private visit(node: string): void {
        if (this.tempMark.has(node)) throw new A_Error("Circular dependency detected");

        if (!this.visited.has(node)) {
            this.tempMark.add(node);
            (this.graph.get(node) || []).forEach(neighbor => this.visit(neighbor));
            this.tempMark.delete(node);
            this.visited.add(node);
            this.sortedEntities.push(node);
        }
    }

    // Sort the entities based on dependencies
    toStages(feature: A_Feature): Array<A_Stage> {
        this.buildGraph();

        // Start topological sort
        this.entities.forEach(entity => {
            if (!this.visited.has(this.ID(entity))) this.visit(this.ID(entity));
        });

        const stages: A_TmpStage[] = [];

        // Map sorted names back to entity objects
        this.sortedEntities
            .map(id => {
                const step = this.entities.find(entity => this.ID(entity) === id)!;

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

        return stages.map(stage => new A_Stage(feature, stage.steps));
    }
}





export class A_TmpStage {

    readonly name: string = 'A_TmpStage';

    private readonly _steps!: A_TYPES__A_StageStep[];

    constructor(
        _steps: A_TYPES__A_StageStep[] = []
    ) {
        this._steps = _steps;
    }


    get before(): string[] {
        return this._steps.reduce((acc, step) => ([
            ...acc,
            ...step.before
        ]), [] as string[]);
    }

    get after(): string[] {
        return this._steps.reduce((acc, step) => ([
            ...acc,
            ...step.after
        ]), [] as string[]);
    }

    get steps(): A_TYPES__A_StageStep[] {
        return this._steps;
    }


    get asyncSteps(): A_TYPES__A_StageStep[] {
        return this._steps.filter(step => step.behavior === 'async');
    }

    get syncSteps(): A_TYPES__A_StageStep[] {
        return this._steps.filter(step => step.behavior === 'sync');
    }


    /**
     * Adds a step to the stage
     * 
     * @param step 
     * @returns 
     */
    add(
        step: A_TYPES__A_StageStep
    ): this {
        this._steps.push(step);

        return this;
    }
}
