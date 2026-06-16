/**
 * ============================================================
 *  A-Concept Performance Benchmark Runner
 * ============================================================
 *
 * Runs all benchmark suites and outputs a consolidated summary.
 *
 * Usage:
 *   npx ts-node -r tsconfig-paths/register benchmarks/run-all.ts
 *   npm run bench
 */
import { BenchResult, printSummary } from './helpers';
import { runStepManagerBenchmarks } from './step-manager.bench';
import { runFeatureTemplateBenchmarks } from './feature-template.bench';
import { runScopeResolveBenchmarks } from './scope-resolve.bench';
import { runFeatureLifecycleBenchmarks } from './feature-lifecycle.bench';


/**
 * Settle between suites: force a full GC (if `--expose-gc` is active) and yield
 * to the event loop long enough for the heap to stabilize. Without this, the
 * residual heap/GC state left by one suite bleeds into the next and inflates its
 * variance — e.g. the A_Feature suite measures ±1.6–5% in isolation but ±7–9%
 * when run right after three other suites in the same process.
 */
async function settle(): Promise<void> {
    (global as any).gc?.();
    await new Promise((r) => setTimeout(r, 250));
    (global as any).gc?.();
}


async function main() {
    console.log('\n🚀 Starting A-Concept Performance Benchmarks...\n');
    console.log(`   Node.js ${process.version}`);
    console.log(`   Date: ${new Date().toISOString()}`);
    console.log(`   Platform: ${process.platform} ${process.arch}`);
    console.log('');

    const allSuites = new Map<string, BenchResult[]>();

    // 1) StepManager benchmarks
    console.log('\n📦 [1/4] A_StepsManager benchmarks...');
    const smResults = await runStepManagerBenchmarks();
    allSuites.set('StepManager', smResults);
    await settle();

    // 2) Feature Template benchmarks
    console.log('\n📦 [2/4] A_Context.featureTemplate benchmarks...');
    const ftResults = await runFeatureTemplateBenchmarks();
    allSuites.set('FeatureTemplate', ftResults);
    await settle();

    // 3) Scope Resolve benchmarks
    console.log('\n📦 [3/4] A_Scope resolve benchmarks...');
    const srResults = await runScopeResolveBenchmarks();
    allSuites.set('ScopeResolve', srResults);
    await settle();

    // 4) Feature Lifecycle benchmarks
    console.log('\n📦 [4/4] A_Feature lifecycle benchmarks...');
    const flResults = await runFeatureLifecycleBenchmarks();
    allSuites.set('FeatureLifecycle', flResults);

    // Consolidated summary
    printSummary(allSuites);

    console.log('\n✅ All benchmarks completed.\n');
}


main().catch((err) => {
    console.error('❌ Benchmark runner failed:', err);
    process.exit(1);
});
