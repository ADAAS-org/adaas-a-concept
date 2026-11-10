import { A_Component } from "@adaas/a-concept/a-component";
import { A_Container } from "@adaas/a-concept/a-container";
import { A_Meta } from "@adaas/a-concept/a-meta";
import { A_Scope } from "@adaas/a-concept/a-scope";

jest.retryTimes(0);

/**
 * Lookups kept between mutations — `A_Scope.hasFlat` per scope version and
 * `A_Meta.find` per key set — follow every change.
 */
describe('A-Scope / A-Meta — lookup caches', () => {

    class Base extends A_Component { }
    class Derived extends Base { }
    class Other extends A_Component { }

    it('has() follows register and deregister in the scope and its parent', () => {
        const parent = new A_Scope({ name: 'Parent' });
        const child = new A_Scope({ name: 'Child' }).inherit(parent);

        expect(child.has(Base)).toBe(false);
        parent.register(Derived);
        expect(child.has(Base)).toBe(true);
        expect(child.has(Derived)).toBe(true);
        expect(child.has(Other)).toBe(false);

        child.register(Other);
        expect(child.has(Other)).toBe(true);
        expect(parent.has(Other)).toBe(false);

        child.deregister(Other);
        expect(child.has(Other)).toBe(false);
        parent.deregister(Derived);
        expect(child.has(Base)).toBe(false);
    });

    it('has() is false for everything after destroy', () => {
        const scope = new A_Scope({ name: 'Gone', components: [Derived] });
        expect(scope.hasFlat(Derived)).toBe(true);
        scope.destroy();
        expect(scope.hasFlat(Derived)).toBe(false);
    });

    it('a container is found through the scope it issued', () => {
        class Host extends A_Container { }
        const host = new Host({ name: 'Host' });
        expect(host.scope.hasFlat(Host)).toBe(true);
        expect(new A_Scope({ name: 'Plain' }).hasFlat(Host)).toBe(false);
    });

    it('find() follows keys added, deleted and replaced', () => {
        const meta = new A_Meta<Record<string, number>>();
        meta.set('.*\\.run$', 1);
        expect(meta.find('Job.run').map(([k]) => k)).toEqual(['.*\\.run$']);

        meta.set('Job\\..*', 2);
        expect(meta.find('Job.run').map(([, v]) => v)).toEqual([1, 2]);

        meta.set('.*\\.run$', 3);
        expect(meta.find('Job.run').map(([, v]) => v)).toEqual([3, 2]);

        meta.delete('Job\\..*');
        expect(meta.find('Job.run').map(([, v]) => v)).toEqual([3]);

        meta.from(new A_Meta<Record<string, number>>());
        expect(meta.find('Job.run')).toEqual([]);
    });
});
