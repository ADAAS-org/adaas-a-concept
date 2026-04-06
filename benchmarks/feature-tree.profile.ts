/**
 * ============================================================
 *  Feature Tree — Fine-Grained Sub-Phase Profiler
 * ============================================================
 *
 * Monkey-patches key prototype/static methods with performance.now()
 * accumulators to expose exactly where time goes during the
 * feature-tree traversal (1111-node, 3-level tree).
 *
 * Run with:
 *   npx ts-node -r tsconfig-paths/register benchmarks/feature-tree.profile.ts
 */
import { A_Component } from '@adaas/a-concept/a-component';
import { A_Feature } from '@adaas/a-concept/a-feature';
import { A_Scope } from '@adaas/a-concept/a-scope';
import { A_Inject } from '@adaas/a-concept/a-inject';
import { A_Caller } from '@adaas/a-concept/a-caller';
import { A_Entity } from '@adaas/a-concept/a-entity';
import { A_Context } from '@adaas/a-concept/a-context';
import { A_Stage } from '@adaas/a-concept/a-stage';

// ─────────────────────────────────────────────────────────────────
//  Accumulator infrastructure
// ─────────────────────────────────────────────────────────────────

type TimerKey =
    | 'entityCall_total'
    | 'featureConstruct_total'
    | 'feature_contextScope'
    | 'feature_callerCreate'
    | 'feature_featureTemplate'
    | 'feature_getSortedSteps'
    | 'feature_stageCreate'
    | 'featureProcess_total'
    | 'stage_process_total'
    | 'stage_getStepComponent'
    | 'stage_getStepArgs'
    | 'stage_handlerAndChildren'
    | 'resolveFlatAll_total'
    | 'scopeFingerprint'
    | 'scopeResolve'
    | 'scopeResolveConstructor';

const T: Record<TimerKey, number> = {} as any;
const C: Record<TimerKey, number> = {} as any;
for (const k of [
    'entityCall_total', 'featureConstruct_total', 'feature_contextScope',
    'feature_callerCreate', 'feature_featureTemplate', 'feature_getSortedSteps',
    'feature_stageCreate', 'featureProcess_total', 'stage_process_total',
    'stage_getStepComponent', 'stage_getStepArgs', 'stage_handlerAndChildren',
    'resolveFlatAll_total', 'scopeFingerprint', 'scopeResolve', 'scopeResolveConstructor'
] as TimerKey[]) {
    T[k] = 0;
    C[k] = 0;
}

let _profiling = false;
function track<R>(key: TimerKey, fn: () => R): R {
    if (!_profiling) return fn();
    const t0 = performance.now();
    const r = fn();
    T[key] += performance.now() - t0;
    C[key]++;
    return r;
}
function resetCounters() {
    for (const k of Object.keys(T) as TimerKey[]) { T[k] = 0; C[k] = 0; }
}


// ─────────────────────────────────────────────────────────────────
//  Monkey-patches  (applied BEFORE entity/scope creation)
// ─────────────────────────────────────────────────────────────────

// ── 1. A_Entity.prototype.call ───────────────────────────────────
const _origEntityCall = (A_Entity.prototype as any).call;
(A_Entity.prototype as any).call = function (feature: string, scope?: A_Scope) {
    return track('entityCall_total', () => {
        // time construction separately
        const feat = track('featureConstruct_total', () =>
            new A_Feature({ name: feature, component: this, scope })
        );
        return track('featureProcess_total', () => feat.process(scope));
    });
};

// ── 2. A_Context.featureTemplate (static) ────────────────────────
const _origFeatureTemplate = A_Context.featureTemplate.bind(A_Context);
(A_Context as any).featureTemplate = function (this: any, ...args: any[]) {
    return track('feature_featureTemplate', () => (_origFeatureTemplate as Function).apply(A_Context, args));
};

// ── 3. A_Context.getSortedStepsFor (static) ──────────────────────
const _origGetSorted = A_Context.getSortedStepsFor.bind(A_Context);
(A_Context as any).getSortedStepsFor = function (this: any, ...args: any[]) {
    return track('feature_getSortedSteps', () => (_origGetSorted as Function).apply(A_Context, args));
};

// ── 4. A_Context.scope (static) — entity→scope lookup ───────────
const _origCtxScope = A_Context.scope.bind(A_Context);
(A_Context as any).scope = function (this: any, ...args: any[]) {
    return track('feature_contextScope', () => (_origCtxScope as Function).apply(A_Context, args));
};

// ── 5. A_Stage.prototype.process ────────────────────────────────
const _origStageProcess = A_Stage.prototype.process;
A_Stage.prototype.process = function (scope?: A_Scope) {
    return track('stage_process_total', () => _origStageProcess.call(this, scope));
};

// ── 6. A_Stage.prototype.getStepComponent (protected) ────────────
const _stageProto: any = A_Stage.prototype;
const _origGetStepComponent = _stageProto.getStepComponent;
_stageProto.getStepComponent = function (scope: A_Scope, step: any) {
    return track('stage_getStepComponent', () => _origGetStepComponent.call(this, scope, step));
};

// ── 7. A_Stage.prototype.getStepArgs (protected) ─────────────────
const _origGetStepArgs = _stageProto.getStepArgs;
_stageProto.getStepArgs = function (scope: A_Scope, step: any) {
    return track('stage_getStepArgs', () => _origGetStepArgs.call(this, scope, step));
};

// ── 8. A_Scope.prototype.resolveFlatAll ──────────────────────────
const _origResolveFlatAll = (A_Scope.prototype as any).resolveFlatAll;
(A_Scope.prototype as any).resolveFlatAll = function (...args: any[]) {
    return track('resolveFlatAll_total', () => _origResolveFlatAll.apply(this, args));
};

// ── 9. A_Scope.prototype.resolve ─────────────────────────────────
const _origScopeResolve = (A_Scope.prototype as any).resolve;
(A_Scope.prototype as any).resolve = function (...args: any[]) {
    return track('scopeResolve', () => _origScopeResolve.apply(this, args));
};

// ── 10. A_Scope.prototype.resolveConstructor ─────────────────────
const _origResolveConstructor = (A_Scope.prototype as any).resolveConstructor;
(A_Scope.prototype as any).resolveConstructor = function (...args: any[]) {
    return track('scopeResolveConstructor', () => _origResolveConstructor.apply(this, args));
};

// ── 11. scope.fingerprint getter ─────────────────────────────────
const _origFingerprintDesc = Object.getOwnPropertyDescriptor(A_Scope.prototype, 'fingerprint')!;
Object.defineProperty(A_Scope.prototype, 'fingerprint', {
    get() {
        return track('scopeFingerprint', () => _origFingerprintDesc.get!.call(this));
    },
    configurable: true,
    enumerable: false,
});


// ─────────────────────────────────────────────────────────────────
//  Tree setup (same 3-level, 10-children tree as the benchmark)
// ─────────────────────────────────────────────────────────────────

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
        (this as any).call('updateFeature', this.scope);
    }

    addChild(child: Node) {
        child.scope.inherit(this.scope);
        this.scope.register(child);
    }
}

class NodeUpdateComponent extends A_Component {
    @A_Feature.Extend({ name: 'updateFeature', after: /.*/, scope: [Node] })
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

function buildTree(): Node {
    const scope = new A_Scope({ name: 'base', components: [NodeUpdateComponent] });
    const root = new Node();
    scope.register(root);
    root.scope.inherit(scope);

    for (let i = 0; i < 10; i++) {
        const child = new Node();
        root.addChild(child);
        for (let j = 0; j < 10; j++) {
            const gc = new Node();
            child.addChild(gc);
            for (let k = 0; k < 10; k++) {
                const ggc = new Node();
                gc.addChild(ggc);
            }
        }
    }
    return root;
}


// ─────────────────────────────────────────────────────────────────
//  Run
// ─────────────────────────────────────────────────────────────────

const WARMUP = 50;
const MEASURE = 200;

const root = buildTree();

// warmup (profiling off so accumulators stay clean)
for (let i = 0; i < WARMUP; i++) root.update();

// measure
_profiling = true;
resetCounters();
const wallStart = performance.now();
for (let i = 0; i < MEASURE; i++) root.update();
const wallTotal = performance.now() - wallStart;
_profiling = false;

// ─────────────────────────────────────────────────────────────────
//  Print results
// ─────────────────────────────────────────────────────────────────

const perIter = (ms: number) => (ms / MEASURE).toFixed(4);
const perCall = (ms: number, key: TimerKey) => C[key] ? (ms / C[key]).toFixed(6) : '-';
const pct = (ms: number) => ((ms / wallTotal) * 100).toFixed(1) + '%';
const fmt = (n: number) => n.toLocaleString();

const NODES_PER_ITER = 1111;

console.log('\n══════════════════════════════════════════════════════════════════════════');
console.log(`  🌲  Feature Tree — Sub-Phase Profile  (${MEASURE} iterations × ${NODES_PER_ITER} nodes)`);
console.log('══════════════════════════════════════════════════════════════════════════\n');
console.log(`  Wall time total : ${wallTotal.toFixed(1)} ms`);
console.log(`  Wall time/iter  : ${(wallTotal / MEASURE).toFixed(3)} ms  (${(MEASURE / (wallTotal / 1000)).toFixed(1)} ops/sec)\n`);

type Row = { label: string; total: string; perIter: string; perCall: string; calls: string; pct: string };

function row(label: string, key: TimerKey | null, totalMs?: number): Row {
    const ms = totalMs !== undefined ? totalMs : (key ? T[key] : 0);
    const calls = key ? C[key] : 0;
    return {
        label,
        total: ms.toFixed(2) + ' ms',
        perIter: perIter(ms) + ' ms',
        perCall: key ? perCall(ms, key) + ' ms' : '-',
        calls: fmt(calls),
        pct: pct(ms),
    };
}

function separator(label: string): Row {
    return { label: '── ' + label, total: '', perIter: '', perCall: '', calls: '', pct: '' };
}

const rows: Row[] = [
    separator('entity.call() — outer wrapper'),
    row('  entity.call() (total)',            'entityCall_total'),

    separator('A_Feature constructor'),
    row('  new A_Feature() (total)',           'featureConstruct_total'),
    row('    A_Context.scope(entity)',         'feature_contextScope'),
    row('    new A_Caller(entity)',            'feature_callerCreate'),
    row('    A_Context.featureTemplate()',     'feature_featureTemplate'),
    row('      scope.fingerprint (inside)',    'scopeFingerprint'),
    row('    A_Context.getSortedStepsFor()',   'feature_getSortedSteps'),
    row('    new A_Stage() × stages',         'feature_stageCreate'),

    separator('A_Feature.process()'),
    row('  feature.process() (total)',         'featureProcess_total'),
    row('    stage.process() (total)',         'stage_process_total'),
    row('      getStepComponent',             'stage_getStepComponent'),
    row('        scope.resolve (all)',         'scopeResolve'),
    row('        scope.resolveConstructor',   'scopeResolveConstructor'),
    row('      getStepArgs',                  'stage_getStepArgs'),
    row('      handler + children',           'stage_handlerAndChildren',
        T.stage_process_total - T.stage_getStepComponent - T.stage_getStepArgs),

    separator('node.children  (scope.resolveFlatAll)'),
    row('  resolveFlatAll(Node)',              'resolveFlatAll_total'),
];

// calculate feature_stageCreate as what's NOT covered by other feature sub-timers
const knownFeatureSubMs = T.feature_contextScope + T.feature_callerCreate + T.feature_featureTemplate + T.feature_getSortedSteps;
rows.find(r => r.label.includes('A_Stage() × stages'))!.total = Math.max(0, T.featureConstruct_total - knownFeatureSubMs).toFixed(2) + ' ms';
rows.find(r => r.label.includes('A_Stage() × stages'))!.perIter = (parseFloat(perIter(T.featureConstruct_total - knownFeatureSubMs)) || 0).toFixed(4) + ' ms';
rows.find(r => r.label.includes('A_Stage() × stages'))!.pct = pct(Math.max(0, T.featureConstruct_total - knownFeatureSubMs));

// column widths
const COL = { label: 42, total: 12, perIter: 12, perCall: 14, calls: 14, pct: 8 };
const header = (s: string, w: number) => s.padEnd(w);
const rpad = (s: string, w: number) => s.padStart(w);

const line = [
    '  ' + header('Phase', COL.label),
    rpad('Total', COL.total),
    rpad('/ iter', COL.perIter),
    rpad('/ call', COL.perCall),
    rpad('Calls', COL.calls),
    rpad('%wall', COL.pct),
].join('  ');

console.log(line);
console.log('  ' + '─'.repeat(COL.label + COL.total + COL.perIter + COL.perCall + COL.calls + COL.pct + 12));

for (const r of rows) {
    if (r.total === '') {
        console.log(`\n  ${r.label}`);
        continue;
    }
    console.log([
        '  ' + header(r.label, COL.label),
        rpad(r.total, COL.total),
        rpad(r.perIter, COL.perIter),
        rpad(r.perCall, COL.perCall),
        rpad(r.calls, COL.calls),
        rpad(r.pct, COL.pct),
    ].join('  '));
}

console.log();
console.log('  NOTE: sub-timer totals may exceed parent totals due to call-graph overlap');
console.log('        (e.g. scope.resolve is called from both getStepComponent and getStepArgs)\n');
