/**
 * ============================================================
 *  A_Feature Chaining Performance Benchmarks
 * ============================================================
 *
 * Measures realistic end-to-end performance of feature chaining:
 *  - Entity creation + scope allocation
 *  - Scope registration overhead
 *  - Feature invocation through entity.call()
 *  - Feature chaining between components (chain())
 *  - Dependency injection overhead (@A_Inject)
 *  - Scaling with chain depth and component count
 *  - Full realistic pipeline: entity → scope → feature → chain → DI
 */
import { A_Component } from "@adaas/a-concept/a-component";
import { A_Feature } from "@adaas/a-concept/a-feature";
import { A_Scope } from "@adaas/a-concept/a-scope";
import { A_Inject } from "@adaas/a-concept/a-inject";
import { A_Caller } from "@adaas/a-concept/a-caller";
import { A_Entity } from "@adaas/a-concept/a-entity";
import { A_Context } from "@adaas/a-concept/a-context";
import { createSuite, BenchResult, printSummary } from './helpers';
import Table from 'cli-table3';

// ──────────────────────────────────────────────────────────────
// Heap measurement helpers
// ──────────────────────────────────────────────────────────────

interface HeapSnapshot {
    benchName: string;
    heapBefore: number;   // bytes
    heapAfter: number;    // bytes
    heapDelta: number;    // bytes
}

function takeHeapSnapshot(): number {
    try { global.gc!(); } catch (_) { /* --expose-gc not set */ }
    return process.memoryUsage().heapUsed;
}

function formatBytes(bytes: number): string {
    const mb = bytes / (1024 * 1024);
    return `${mb >= 0 ? '+' : ''}${mb.toFixed(2)} MB`;
}

function printHeapTable(title: string, snapshots: HeapSnapshot[]) {
    console.log(`\n${'─'.repeat(70)}`);
    console.log(`  🧠  ${title} — Heap Usage`);
    console.log(`${'─'.repeat(70)}`);

    const table = new Table({
        head: ['Benchmark', 'Heap Before', 'Heap After', 'Δ Heap'],
        colWidths: [40, 14, 14, 14],
        style: { head: ['yellow'] },
    });

    for (const s of snapshots) {
        table.push([
            s.benchName,
            (s.heapBefore / 1024 / 1024).toFixed(2) + ' MB',
            (s.heapAfter / 1024 / 1024).toFixed(2) + ' MB',
            formatBytes(s.heapDelta),
        ]);
    }

    console.log(table.toString());
}



class Node extends A_Entity {

    protected _scope!: A_Scope;


    get children(): Node[] {
        return this.scope.resolveFlatAll(Node) || [];
    }

    get scope(): A_Scope {
        if (!this._scope) {
            this._scope = A_Context.allocate(this, new A_Scope({ name: `${this.aseid.id}-scope` }));
        }
        return this._scope;
    }

    update() {
        this.call('updateFeature', this.scope);
    }


    addChild(child: Node) {
        child.scope.inherit(this.scope);
        this.scope.register(child);
    }
}


class NodeUpdateComponent extends A_Component {

    @A_Feature.Extend({
        name: 'updateFeature',
        after: /.*/,
        scope: [Node]
    })
    updateNode(
        @A_Inject(A_Caller) node: Node,
        @A_Inject(A_Scope) scope: A_Scope,
        @A_Inject(A_Feature) feature: A_Feature
    ) {
        for (const child of node.children) {
            child.update();
        }
    }
}

// ──────────────────────────────────────────────────────────────
// Benchmark Suites
// ──────────────────────────────────────────────────────────────

export async function runFeatureChainingBenchmarks(): Promise<any> {
    const allResults: BenchResult[] = [];
    const heapSnapshots: HeapSnapshot[] = [];



    // ── Suite 3: Feature Call — Baseline (no chain) ─────────
    const baselineResults = await createSuite('Feature Tree Call', (suite) => {
        const scope = new A_Scope({
            name: 'base',
            components: [NodeUpdateComponent]
        });

        const entity = new Node();

        scope.register(entity);

        entity.scope.inherit(scope);

        // Heap tracking state — shared across benchmarks in this suite
        let currentHeapBefore = 0;

        /**
         * Fill entity tree with 3 levels and 10 children at each level (total 111 nodes)
         */
        for (let i = 0; i < 10; i++) {
            const child = new Node();
            entity.addChild(child);

            for (let j = 0; j < 10; j++) {
                const grandChild = new Node();
                child.addChild(grandChild);

                for (let k = 0; k < 10; k++) {
                    const greatGrandChild = new Node();
                    grandChild.addChild(greatGrandChild);
                }
            }
        }



        suite
            .on('cycle', (event: any) => {
                const heapAfter = takeHeapSnapshot();
                heapSnapshots.push({
                    benchName: event.target.name,
                    heapBefore: currentHeapBefore,
                    heapAfter,
                    heapDelta: heapAfter - currentHeapBefore,
                });
            })

        suite
            .add('Feature Tree Call', {
                onStart: () => { currentHeapBefore = takeHeapSnapshot(); },
                fn: () => {
                    entity.update();
                }
            })

    });
    allResults.push(...baselineResults);

    // Print heap summary
    printHeapTable('Feature Call — Baseline (no chain)', heapSnapshots);

    return allResults;
}


// ──────────────────────────────────────────────────────────────
// Standalone runner
// ──────────────────────────────────────────────────────────────
if (require.main === module) {
    runFeatureChainingBenchmarks()
        .then((results) => {
            const summary = new Map<string, BenchResult[]>();
            summary.set('FeatureChaining', results);
            printSummary(summary);
            console.log('\n✅ Feature chaining benchmarks completed.\n');
        })
        .catch(console.error);
}
