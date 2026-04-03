/**
 * ============================================================
 *  A_Context.featureTemplate Performance Benchmarks
 * ============================================================
 *
 * Measures:
 *  - featureTemplate() — full template assembly
 *  - featureDefinition() — base definition lookup
 *  - featureExtensions() — extension collection from scope
 *  - Scaling with number of components in scope
 */
import { A_Component } from "@adaas/a-concept/a-component";
import { A_Feature } from "@adaas/a-concept/a-feature";
import { A_Scope } from "@adaas/a-concept/a-scope";
import { A_Context } from "@adaas/a-concept/a-context";
import { A_Inject } from "@adaas/a-concept/a-inject";
import { A_Caller } from "@adaas/a-concept/a-caller";
import { createSuite, BenchResult } from './helpers';


// ──────────────────────────────────────────────────────────────
// Fixture: components with feature definitions & extensions
// ──────────────────────────────────────────────────────────────

class CoreComponent extends A_Component {
    @A_Feature.Define({ invoke: true })
    @A_Feature.Extend({ name: 'coreFeature' })
    async coreMethod() { }
}

class ExtensionComponent_A extends A_Component {
    @A_Feature.Extend({ name: 'coreFeature' })
    async extensionA() { }
}

class ExtensionComponent_B extends A_Component {
    @A_Feature.Extend({ name: 'coreFeature' })
    async extensionB() { }
}

class ExtensionComponent_C extends A_Component {
    @A_Feature.Extend({ name: 'coreFeature' })
    async extensionC() { }
}

class ExtensionComponent_D extends A_Component {
    @A_Feature.Extend({ name: 'coreFeature' })
    async extensionD() { }
}

class ExtensionComponent_E extends A_Component {
    @A_Feature.Extend({ name: 'coreFeature' })
    async extensionE() { }
}


// --- For inheritance tests ---

class ParentComponent extends A_Component {
    @A_Feature.Define({ invoke: false })
    async parentFeature() { }

    @A_Feature.Extend({ name: 'parentFeature' })
    async parentStep() { }
}

class ChildComponent extends ParentComponent {
    @A_Feature.Extend({ name: 'parentFeature' })
    async childStep() { }
}

class GrandchildComponent extends ChildComponent { }


// --- For multi-feature tests ---

class MultiFeatureComponent extends A_Component {
    @A_Feature.Define({ invoke: true })
    @A_Feature.Extend({ name: 'feature1' })
    async feature1() { }

    @A_Feature.Define({ invoke: true })
    @A_Feature.Extend({ name: 'feature2' })
    async feature2() { }

    @A_Feature.Define({ invoke: true })
    @A_Feature.Extend({ name: 'feature3' })
    async feature3() { }
}


// ──────────────────────────────────────────────────────────────
// Benchmark Suites
// ──────────────────────────────────────────────────────────────

export async function runFeatureTemplateBenchmarks(): Promise<BenchResult[]> {
    const allResults: BenchResult[] = [];

    // Suite 1: featureTemplate with varying scope sizes
    const templateResults = await createSuite('A_Context.featureTemplate — Scope Size', (suite) => {
        // Small scope: 2 components
        const scopeSmall = new A_Scope({
            name: 'SmallScope',
            components: [CoreComponent, ExtensionComponent_A]
        });
        const compSmall = scopeSmall.resolve(CoreComponent)!;

        // Medium scope: 4 components
        const scopeMedium = new A_Scope({
            name: 'MediumScope',
            components: [CoreComponent, ExtensionComponent_A, ExtensionComponent_B, ExtensionComponent_C]
        });
        const compMedium = scopeMedium.resolve(CoreComponent)!;

        // Large scope: 6 components
        const scopeLarge = new A_Scope({
            name: 'LargeScope',
            components: [
                CoreComponent,
                ExtensionComponent_A,
                ExtensionComponent_B,
                ExtensionComponent_C,
                ExtensionComponent_D,
                ExtensionComponent_E
            ]
        });
        const compLarge = scopeLarge.resolve(CoreComponent)!;

        suite
            .add('featureTemplate (2 components)', () => {
                A_Context.featureTemplate('coreFeature', compSmall, scopeSmall);
            })
            .add('featureTemplate (4 components)', () => {
                A_Context.featureTemplate('coreFeature', compMedium, scopeMedium);
            })
            .add('featureTemplate (6 components)', () => {
                A_Context.featureTemplate('coreFeature', compLarge, scopeLarge);
            });
    });
    allResults.push(...templateResults);

    // Suite 2: featureDefinition vs featureExtensions breakdown
    const breakdownResults = await createSuite('A_Context — Definition vs Extensions breakdown', (suite) => {
        const scope = new A_Scope({
            name: 'BreakdownScope',
            components: [
                CoreComponent,
                ExtensionComponent_A,
                ExtensionComponent_B,
                ExtensionComponent_C,
            ]
        });
        const comp = scope.resolve(CoreComponent)!;

        suite
            .add('featureDefinition only', () => {
                A_Context.featureDefinition('coreFeature', comp);
            })
            .add('featureExtensions only', () => {
                A_Context.featureExtensions('coreFeature', comp, scope);
            })
            .add('featureTemplate (combined)', () => {
                A_Context.featureTemplate('coreFeature', comp, scope);
            });
    });
    allResults.push(...breakdownResults);

    // Suite 3: Inheritance depth impact
    const inheritanceResults = await createSuite('A_Context.featureTemplate — Inheritance Depth', (suite) => {
        // Direct component
        const scopeDirect = new A_Scope({
            name: 'DirectScope',
            components: [ParentComponent]
        });
        const compDirect = scopeDirect.resolve(ParentComponent)!;

        // 1-level inheritance
        const scopeChild = new A_Scope({
            name: 'ChildScope',
            components: [ChildComponent]
        });
        const compChild = scopeChild.resolve(ChildComponent)!;

        // 2-level inheritance
        const scopeGrandchild = new A_Scope({
            name: 'GrandchildScope',
            components: [GrandchildComponent]
        });
        const compGrandchild = scopeGrandchild.resolve(GrandchildComponent)!;

        suite
            .add('featureTemplate (no inheritance)', () => {
                A_Context.featureTemplate('parentFeature', compDirect, scopeDirect);
            })
            .add('featureTemplate (1-level inherit)', () => {
                A_Context.featureTemplate('parentFeature', compChild, scopeChild);
            })
            .add('featureTemplate (2-level inherit)', () => {
                A_Context.featureTemplate('parentFeature', compGrandchild, scopeGrandchild);
            });
    });
    allResults.push(...inheritanceResults);

    return allResults;
}


// Run standalone
if (require.main === module) {
    runFeatureTemplateBenchmarks().catch(console.error);
}
