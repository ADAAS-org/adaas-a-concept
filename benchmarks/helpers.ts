import Benchmark from 'benchmark';
import Table from 'cli-table3';

/**
 * Result object collected after each benchmark completes
 */
export interface BenchResult {
    name: string;
    opsPerSec: string;
    meanMs: string;
    rme: string;
    samples: number;
}

/**
 * Creates and runs a Benchmark.js suite with formatted table output.
 *
 * @param suiteName  — Human-readable group name (printed as header)
 * @param addBenchmarks — callback that receives `suite.add(...)` bound method
 * @returns Promise that resolves with collected results
 */
export function createSuite(
    suiteName: string,
    addBenchmarks: (suite: Benchmark.Suite) => void
): Promise<BenchResult[]> {
    return new Promise((resolve) => {
        const suite = new Benchmark.Suite(suiteName);
        const results: BenchResult[] = [];

        addBenchmarks(suite);

        suite
            .on('cycle', (event: Benchmark.Event) => {
                const bench = event.target as any;
                results.push({
                    name: bench.name,
                    opsPerSec: bench.hz.toFixed(2),
                    meanMs: (bench.stats.mean * 1000).toFixed(4),
                    rme: bench.stats.rme.toFixed(2),
                    samples: bench.stats.sample.length,
                });
            })
            .on('complete', () => {
                printTable(suiteName, results);
                resolve(results);
            })
            .run({ async: false });
    });
}

/**
 * Prints a formatted table of benchmark results to stdout
 */
export function printTable(title: string, results: BenchResult[]) {
    console.log(`\n${'═'.repeat(70)}`);
    console.log(`  📊  ${title}`);
    console.log(`${'═'.repeat(70)}`);

    const table = new Table({
        head: ['Benchmark', 'ops/sec', 'mean (ms)', '± %', 'samples'],
        colWidths: [40, 14, 14, 10, 10],
        style: {
            head: ['cyan'],
        },
    });

    for (const r of results) {
        table.push([r.name, r.opsPerSec, r.meanMs, `±${r.rme}%`, r.samples]);
    }

    console.log(table.toString());
}

/**
 * Prints a summary comparison table across all suites
 */
export function printSummary(allResults: Map<string, BenchResult[]>) {
    console.log(`\n${'═'.repeat(70)}`);
    console.log(`  📋  PERFORMANCE SUMMARY`);
    console.log(`${'═'.repeat(70)}`);

    const table = new Table({
        head: ['Suite', 'Benchmark', 'ops/sec', 'mean (ms)'],
        colWidths: [25, 35, 14, 14],
        style: {
            head: ['green'],
        },
    });

    for (const [suite, results] of allResults) {
        for (const r of results) {
            table.push([suite, r.name, r.opsPerSec, r.meanMs]);
        }
    }

    console.log(table.toString());
}
