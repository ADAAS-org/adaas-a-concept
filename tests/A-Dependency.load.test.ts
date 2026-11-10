import { A_Component } from "@adaas/a-concept/a-component";
import { A_Dependency, A_DependencyLoader, A_TYPES__A_DependencyLoaded } from "@adaas/a-concept/a-dependency";
import { A_Feature } from "@adaas/a-concept/a-feature";
import { A_Inject } from "@adaas/a-concept/a-inject";
import { A_Scope, A_ScopeError } from "@adaas/a-concept/a-scope";
import { A_StageError } from "@adaas/a-concept/a-stage";



describe('A-Dependency Load (lazy loading)', () => {

    it('Should load a missing injection through the scope loader before the step runs', async () => {
        const received: any[] = [];
        const requests: Array<{ name: string, source?: string }> = [];

        class Tool extends A_Component {
            describe() { return 'base'; }
        }
        // "Lives in a package" — not known to the scope until loaded.
        class SearchTool extends Tool {
            describe() { return 'search'; }
        }

        class PackageLoader extends A_DependencyLoader {
            async load(dependency: A_Dependency<any>): Promise<A_TYPES__A_DependencyLoaded> {
                requests.push({ name: dependency.name, source: dependency.source });
                return [SearchTool];
            }
        }

        class Host extends A_Component {
            @A_Feature.Extend({ name: 'run' })
            async step(
                @A_Dependency.Load('pkg:tools')
                @A_Inject(Tool) tool: Tool,
            ) {
                received.push(tool);
            }
        }

        const scope = new A_Scope({
            name: 'RunScope',
            components: [Host],
            fragments: [new PackageLoader()],
        });

        await scope.resolve(Host)!.call('run');

        expect(requests).toEqual([{ name: 'Tool', source: 'pkg:tools' }]);
        expect(received[0]).toBeInstanceOf(SearchTool);
        expect(received[0].describe()).toBe('search');
        expect(scope.has(SearchTool)).toBe(true);

        // Second call: already registered → no second load
        await scope.resolve(Host)!.call('run');
        expect(requests.length).toBe(1);
        expect(received[1]).toBe(received[0]);
    });

    it('Should let loaded components extend later features (scope.load)', async () => {
        const order: string[] = [];

        class Plugin extends A_Component {
            @A_Feature.Extend({ name: 'run' })
            async extend() {
                order.push('plugin');
            }
        }

        class PackageLoader extends A_DependencyLoader {
            async load(dependency: A_Dependency<any>): Promise<A_TYPES__A_DependencyLoaded | undefined> {
                return dependency.source === 'pkg:plugin' ? [Plugin] : undefined;
            }
        }

        class Host extends A_Component {
            @A_Feature.Extend({ name: 'run' })
            async own() {
                order.push('host');
            }
        }

        const scope = new A_Scope({
            name: 'RunScope',
            components: [Host],
            fragments: [new PackageLoader()],
        });

        await scope.resolve(Host)!.call('run');
        expect(order).toEqual(['host']);

        const loaded = await scope.load('Plugin', 'pkg:plugin');
        expect(loaded).toBeInstanceOf(Plugin);

        order.length = 0;
        await scope.resolve(Host)!.call('run');
        expect(order.sort()).toEqual(['host', 'plugin']);
    });

    it('Should use a loader registered in a parent scope and share concurrent loads', async () => {
        let calls = 0;

        class Lazy extends A_Component { }

        class SlowLoader extends A_DependencyLoader {
            async load(): Promise<A_TYPES__A_DependencyLoaded> {
                calls++;
                await new Promise(resolve => setTimeout(resolve, 5));
                return [Lazy];
            }
        }

        const root = new A_Scope({ name: 'Root', fragments: [new SlowLoader()] });
        const run = new A_Scope({ name: 'Run' }).inherit(root);

        const [a, b] = await Promise.all([run.load(Lazy), run.load(Lazy)]);

        expect(calls).toBe(1);
        expect(a).toBeInstanceOf(Lazy);
        expect(b).toBe(a);
        expect(run.hasFlat(Lazy)).toBe(true);
        expect(root.hasFlat(Lazy)).toBe(false);
    });

    it('Should not load what already resolves', async () => {
        let calls = 0;

        class Present extends A_Component { }

        class CountingLoader extends A_DependencyLoader {
            async load(): Promise<A_TYPES__A_DependencyLoaded> {
                calls++;
                return [];
            }
        }

        const scope = new A_Scope({ components: [Present], fragments: [new CountingLoader()] });

        expect(await scope.load(Present)).toBeInstanceOf(Present);
        expect(calls).toBe(0);
    });

    it('Should throw a resolution error from scope.load without a loader', async () => {
        class Missing extends A_Component { }

        const scope = new A_Scope({ name: 'NoLoader' });

        await expect(scope.load(Missing)).rejects.toBeInstanceOf(A_ScopeError);
    });

    it('Should keep plain resolution unchanged without a loader (optional injection is undefined)', async () => {
        const received: any[] = [];

        class Missing extends A_Component { }

        class Host extends A_Component {
            @A_Feature.Extend({ name: 'run' })
            step(
                @A_Dependency.Load()
                @A_Inject(Missing) missing?: Missing,
            ) {
                received.push(missing);
            }
        }

        const scope = new A_Scope({ components: [Host] });

        await scope.resolve(Host)!.call('run');

        expect(received).toEqual([undefined]);
    });

    it('Should fail the step when the loader fails', async () => {
        class Tool extends A_Component { }

        class BrokenLoader extends A_DependencyLoader {
            async load(): Promise<A_TYPES__A_DependencyLoaded> {
                throw new Error('integrity mismatch');
            }
        }

        class Host extends A_Component {
            @A_Feature.Extend({ name: 'run' })
            async step(
                @A_Dependency.Load('pkg:tools')
                @A_Inject(Tool) tool: Tool,
            ) { }
        }

        const scope = new A_Scope({ components: [Host], fragments: [new BrokenLoader()] });

        let caught: any;
        try {
            await scope.resolve(Host)!.call('run');
        } catch (error) {
            caught = error;
        }

        expect(caught).toBeDefined();
        // Walk the error chain down to the loader's error
        const titles: string[] = [];
        const messages: string[] = [];
        for (let e = caught, i = 0; e && i < 10; e = e.originalError, i++) {
            if (e.title) titles.push(e.title);
            if (e.message) messages.push(e.message);
        }
        expect(titles).toContain(A_StageError.ArgumentsResolutionError);
        expect(messages.some(m => m.includes('integrity mismatch'))).toBe(true);
    });

    it('Should serialize the load source', () => {
        const dependency = new A_Dependency('Tool', { load: true, source: 'pkg:tools' });

        expect(dependency.load).toBe(true);
        expect(dependency.source).toBe('pkg:tools');
        expect(dependency.toJSON().source).toBe('pkg:tools');
    });
});
