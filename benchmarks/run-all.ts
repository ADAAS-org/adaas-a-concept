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

    // 2) Feature Template benchmarks
    console.log('\n📦 [2/4] A_Context.featureTemplate benchmarks...');
    const ftResults = await runFeatureTemplateBenchmarks();
    allSuites.set('FeatureTemplate', ftResults);

    // 3) Scope Resolve benchmarks
    console.log('\n📦 [3/4] A_Scope resolve benchmarks...');
    const srResults = await runScopeResolveBenchmarks();
    allSuites.set('ScopeResolve', srResults);

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
