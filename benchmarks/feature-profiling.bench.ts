/**
 * Feature Lifecycle Profiling Benchmark
 * 
 * Realistic profiling of the A_Feature lifecycle using the actual production path:
 *   new A_Feature({ name, component, scope }) → feature.process(scope)
 * 
 * Uses 25 extension components (≈26 stages total) to simulate a real-world
 * scenario where many components extend the same feature.
 * 
 * Two profiling modes:
 *  1. Black-box: times `new A_Feature(...)` and `.process()` as the user sees them
 *  2. Internals breakdown: manually instruments fromComponent() sub-steps
 */
import { A_Context } from '@adaas/a-concept/a-context';
import { A_Component } from '@adaas/a-concept/a-component';
import { A_Container } from '@adaas/a-concept/a-container';
import { A_Feature } from '@adaas/a-concept/a-feature';
import { A_Scope } from '@adaas/a-concept/a-scope';
import { A_Inject } from '@adaas/a-concept/a-inject';
import { A_Caller } from '@adaas/a-concept/a-caller';
import { A_StepsManager } from '@adaas/a-concept/a-step-manager';
import { A_TypeGuards } from '@adaas/a-concept/helpers/A_TypeGuards.helper';

// ── helpers ──────────────────────────────────────────────────────
function hrMs(start: [number, number]): number {
    const diff = process.hrtime(start);
    return diff[0] * 1000 + diff[1] / 1e6;
}

function median(arr: number[]): number {
    const s = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(s.length / 2);
    return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

function p99(arr: number[]): number {
    const s = [...arr].sort((a, b) => a - b);
    return s[Math.floor(s.length * 0.99)];
}

function avg(arr: number[]): number {
    return arr.reduce((a, b) => a + b, 0) / arr.length;
}

// ── dynamic component generation ─────────────────────────────────
const NUM_EXTENSIONS = 25;

/**
 * Dynamically generates N extension component classes that extend the same feature.
 * Each component has a single handler with @A_Inject(A_Caller).
 */
function generateExtensionComponents(count: number): Array<typeof A_Component> {
    const components: Array<typeof A_Component> = [];

    for (let i = 0; i < count; i++) {
        // Create a unique class per extension
        const ExtComp = class extends A_Component {
            handler(caller: any) {
                return;
            }
        };

        // Give it a unique name for debugging
        Object.defineProperty(ExtComp, 'name', { value: `Ext_${i}` });

        // Apply decorators programmatically (same as @A_Feature.Extend + @A_Inject)
        A_Feature.Extend({ name: 'profileFeature' })(
            ExtComp.prototype,
            'handler',
            Object.getOwnPropertyDescriptor(ExtComp.prototype, 'handler')!
        );

        A_Inject(A_Caller)(ExtComp.prototype, 'handler', 0);

        components.push(ExtComp);
    }

    return components;
}

// ── setup ────────────────────────────────────────────────────────
function setupEnvironment() {
    A_Context.reset();

    class ProfilingComponent extends A_Component {
        @A_Feature.Define({ name: 'profileFeature', invoke: true })
        profileHandler(
            @A_Inject(A_Caller) caller: any
        ) {
            return;
        }
    }

    const extensionComponents = generateExtensionComponents(NUM_EXTENSIONS);

    const container = new A_Container({
        name: 'ProfilingContainer',
        components: [ProfilingComponent, ...extensionComponents]
    });

    const component = container.scope.resolve(ProfilingComponent)!;
    const stageCount = 1 + NUM_EXTENSIONS; // 1 define + N extensions

    return { container, component, ProfilingComponent, extensionComponents, stageCount };
}

// ── profiling run ────────────────────────────────────────────────
export async function runFeatureProfilingBenchmarks() {
    const ITERATIONS = 2000;
    const WARMUP = 200;

    const { container, component, stageCount } = setupEnvironment();

    // ═══════════════════════════════════════════════════════════════
    //  PART 1: Black-box profiling (realistic production path)
    // ═══════════════════════════════════════════════════════════════
    const blackBox = {
        construct: [] as number[],
        process: [] as number[],
        total: [] as number[],
    };

    for (let i = 0; i < ITERATIONS + WARMUP; i++) {
        const isWarmup = i < WARMUP;

        const tTotal = process.hrtime();

        // This is exactly how features are called in production:
        //   const newFeature = new A_Feature({ name, component, scope });
        //   return await newFeature.process(scope);
        const tConstruct = process.hrtime();
        const feature = new A_Feature({
            name: 'profileFeature',
            component: component,
        });
        const constructTime = hrMs(tConstruct);

        const tProcess = process.hrtime();
        feature.process();
        const processTime = hrMs(tProcess);

        const totalTime = hrMs(tTotal);

        if (!isWarmup) {
            blackBox.construct.push(constructTime);
            blackBox.process.push(processTime);
            blackBox.total.push(totalTime);
        }
    }

    // ═══════════════════════════════════════════════════════════════
    //  PART 2: Internals breakdown (mirrors fromComponent sub-steps)
    // ═══════════════════════════════════════════════════════════════
    const internals = {
        scopeGet: [] as number[],
        callerCreate: [] as number[],
        scopeAllocate: [] as number[],
        scopeInherit: [] as number[],
        featureTemplate: [] as number[],
        stepsManagerCreate: [] as number[],
        toStages: [] as number[],
        totalConstruct: [] as number[],
        // per-stage breakdown (aggregated across all stages in each iteration)
        stageProcess: [] as number[],
        stageGetComponent: [] as number[],
        stageGetArgs: [] as number[],
        stageCallHandler: [] as number[],
        totalProcess: [] as number[],
        scopeDestroy: [] as number[],
        totalLifecycle: [] as number[],
    };

    for (let i = 0; i < ITERATIONS + WARMUP; i++) {
        const isWarmup = i < WARMUP;

        // ─── CONSTRUCTION PHASE (mirrors fromComponent) ──────────
        const tTotalStart = process.hrtime();

        // 1) Get component scope
        const t1 = process.hrtime();
        const componentScope = A_Context.scope(component);
        const scopeGetTime = hrMs(t1);

        // 2) Create caller
        const t2 = process.hrtime();
        const caller = new A_Caller(component);
        const callerCreateTime = hrMs(t2);

        // 3) Allocate scope
        const t3 = process.hrtime();
        const featurePlaceholder = Object.create(A_Feature.prototype);
        featurePlaceholder._name = 'profileFeature';
        featurePlaceholder._caller = caller;
        featurePlaceholder._state = 0;
        featurePlaceholder._stages = [];
        featurePlaceholder._index = 0;
        const scope = A_Context.allocate(featurePlaceholder);
        const scopeAllocateTime = hrMs(t3);

        // 4) Inherit scope
        const t4 = process.hrtime();
        scope.inherit(componentScope);
        const scopeInheritTime = hrMs(t4);

        // 5) Get feature template (this is the key step — same as fromComponent step 6)
        const t5 = process.hrtime();
        const template = A_Context.featureTemplate('profileFeature', caller.component, scope);
        const featureTemplateTime = hrMs(t5);

        // 6) Create StepsManager
        const t6 = process.hrtime();
        const sm = new A_StepsManager(template as any[]);
        const stepsManagerCreateTime = hrMs(t6);

        // 7) Create stages
        const t7 = process.hrtime();
        const stages = sm.toStages(featurePlaceholder);
        const toStagesTime = hrMs(t7);

        const constructTime = hrMs(tTotalStart);

        // ─── PROCESSING PHASE (mirrors stage.process internals) ──
        const tProcessStart = process.hrtime();

        for (const stage of stages) {
            const tStage = process.hrtime();

            // a) getStepComponent — resolve component instance
            const tComp = process.hrtime();
            const dep = stage.definition.dependency;
            const instance = scope.resolve(dep) || scope.resolve(dep);
            const getComponentTime = hrMs(tComp);

            // b) getStepArgs — DI resolution
            const tArgs = process.hrtime();
            let resolverConstructor =
                (stage.definition.dependency.target as any)
                || scope.resolveConstructor(stage.definition.dependency.name);
            const injections = A_Context
                .meta(resolverConstructor)
                .injections(stage.definition.handler);
            const resolvedArgs = injections.map((dependency: any) => {
                if (A_TypeGuards.isCallerConstructor(dependency.target)) {
                    return caller.component;
                }
                if (A_TypeGuards.isFeatureConstructor(dependency.target)) {
                    return featurePlaceholder;
                }
                return scope.resolve(dependency);
            });
            const getArgsTime = hrMs(tArgs);

            // c) actual handler call
            const tCall = process.hrtime();
            if (instance && (instance as any)[stage.definition.handler]) {
                (instance as any)[stage.definition.handler].call(instance, ...resolvedArgs);
            }
            const callHandlerTime = hrMs(tCall);

            const stageTime = hrMs(tStage);

            if (!isWarmup) {
                internals.stageProcess.push(stageTime);
                internals.stageGetComponent.push(getComponentTime);
                internals.stageGetArgs.push(getArgsTime);
                internals.stageCallHandler.push(callHandlerTime);
            }
        }

        const processTime = hrMs(tProcessStart);

        // CLEANUP
        const tDestroy = process.hrtime();
        scope.destroy();
        const destroyTime = hrMs(tDestroy);

        try { A_Context.deallocate(featurePlaceholder); } catch (e) { }

        const totalTime = hrMs(tTotalStart);

        if (!isWarmup) {
            internals.scopeGet.push(scopeGetTime);
            internals.callerCreate.push(callerCreateTime);
            internals.scopeAllocate.push(scopeAllocateTime);
            internals.scopeInherit.push(scopeInheritTime);
            internals.featureTemplate.push(featureTemplateTime);
            internals.stepsManagerCreate.push(stepsManagerCreateTime);
            internals.toStages.push(toStagesTime);
            internals.scopeDestroy.push(destroyTime);
            internals.totalConstruct.push(constructTime);
            internals.totalProcess.push(processTime);
            internals.totalLifecycle.push(totalTime);
        }
    }

    // ── Print results ────────────────────────────────────────
    console.log('\n══════════════════════════════════════════════════════════════════════════════');
    console.log(`  📊  A_Feature Lifecycle — Realistic Profiling (${stageCount} stages: 1 define + ${NUM_EXTENSIONS} extensions)`);
    console.log('══════════════════════════════════════════════════════════════════════════════\n');

    // ── Part 1: Black-box results ────────────────────────────
    console.log('  ┌─────────────────────────────────────────────────────────────────────────┐');
    console.log('  │  PART 1: Production Path (new A_Feature + .process())                   │');
    console.log('  └─────────────────────────────────────────────────────────────────────────┘\n');

    const bbPhases: [string, keyof typeof blackBox][] = [
        ['  new A_Feature({ component })', 'construct'],
        ['  feature.process()', 'process'],
        ['  ═══ TOTAL', 'total'],
    ];

    console.log(
        '  Phase'.padEnd(44) +
        'median'.padStart(10) +
        'avg'.padStart(10) +
        'p99'.padStart(10) +
        'min'.padStart(10) +
        'max'.padStart(10)
    );
    console.log('  ' + '─'.repeat(90));

    for (const [label, key] of bbPhases) {
        const arr = blackBox[key];
        const med = median(arr);
        const a = avg(arr);
        const p = p99(arr);
        const mn = Math.min(...arr);
        const mx = Math.max(...arr);
        const pct = (a / avg(blackBox.total) * 100).toFixed(1);

        console.log(
            `  ${label.padEnd(42)}` +
            `${med.toFixed(4).padStart(10)}` +
            `${a.toFixed(4).padStart(10)}` +
            `${p.toFixed(4).padStart(10)}` +
            `${mn.toFixed(4).padStart(10)}` +
            `${mx.toFixed(4).padStart(10)}` +
            `  (${pct}%)`
        );
    }

    // ── Part 2: Internals breakdown ──────────────────────────
    console.log('\n\n  ┌─────────────────────────────────────────────────────────────────────────┐');
    console.log('  │  PART 2: Internals Breakdown (fromComponent sub-steps)                  │');
    console.log('  └─────────────────────────────────────────────────────────────────────────┘\n');

    const phases: [string, string][] = [
        ['CONSTRUCTION PHASE', ''],
        ['  A_Context.scope(component)', 'scopeGet'],
        ['  new A_Caller()', 'callerCreate'],
        ['  A_Context.allocate()', 'scopeAllocate'],
        ['  scope.inherit()', 'scopeInherit'],
        ['  A_Context.featureTemplate()', 'featureTemplate'],
        ['  new A_StepsManager()', 'stepsManagerCreate'],
        ['  SM.toStages()', 'toStages'],
        ['  ─── Construction Total', 'totalConstruct'],
        ['', ''],
        [`PROCESSING PHASE (per-stage avg, ${stageCount} stages)`, ''],
        ['  getStepComponent (resolve)', 'stageGetComponent'],
        ['  getStepArgs (DI injection)', 'stageGetArgs'],
        ['  handler call', 'stageCallHandler'],
        ['  ─── Stage Total (per-stage)', 'stageProcess'],
        ['  ─── All Stages Total', 'totalProcess'],
        ['', ''],
        ['CLEANUP PHASE', ''],
        ['  scope.destroy()', 'scopeDestroy'],
        ['', ''],
        ['═══ TOTAL LIFECYCLE', 'totalLifecycle'],
    ];

    console.log(
        '  Phase'.padEnd(44) +
        'median'.padStart(10) +
        'avg'.padStart(10) +
        'p99'.padStart(10) +
        'min'.padStart(10) +
        'max'.padStart(10)
    );
    console.log('  ' + '─'.repeat(90));

    for (const [label, key] of phases) {
        if (!key) {
            if (label) console.log(`\n  ${label}`);
            continue;
        }
        const arr = (internals as any)[key] as number[];
        const med = median(arr);
        const a = avg(arr);
        const p = p99(arr);
        const mn = Math.min(...arr);
        const mx = Math.max(...arr);

        const pctOfTotal = (a / avg(internals.totalLifecycle) * 100).toFixed(1);

        console.log(
            `  ${label.padEnd(42)}` +
            `${med.toFixed(4).padStart(10)}` +
            `${a.toFixed(4).padStart(10)}` +
            `${p.toFixed(4).padStart(10)}` +
            `${mn.toFixed(4).padStart(10)}` +
            `${mx.toFixed(4).padStart(10)}` +
            `  (${pctOfTotal}%)`
        );
    }

    console.log('\n  ' + '─'.repeat(90));
    console.log(`  Iterations: ${ITERATIONS} (after ${WARMUP} warmup)`);
    console.log(`  Stages per feature: ${stageCount} (1 define + ${NUM_EXTENSIONS} extensions)`);
    console.log(`  Production path: new A_Feature({ name, component }) → feature.process()\n`);
}

// Run standalone
if (require.main === module) {
    runFeatureProfilingBenchmarks().catch(console.error);
}
