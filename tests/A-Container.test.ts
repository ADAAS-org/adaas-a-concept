import { A_Concept } from '@adaas/a-concept/a-concept';
import { A_Container } from '@adaas/a-concept/a-container';
import { A_Context } from '@adaas/a-concept/a-context';
import { A_Feature } from '@adaas/a-concept/a-feature';
import { A_Scope } from '@adaas/a-concept/a-scope';


describe('A-Container tests', () => {

    it('Should allow to create a concept', async () => {
        const container = new A_Container();
        expect(container).toBeInstanceOf(A_Container);
        expect(container.scope).toBeDefined();
        expect(container.scope).toBeInstanceOf(A_Scope);
    });
    it('Should allow to define and extend features on container level', async () => {
        const results: string[] = [];


        class customContainer extends A_Container {


            @A_Concept.Start()
            async start() {
                results.push('started');

                await this.call('testFeature');
            }

            @A_Feature.Extend({
                name: 'testFeature',
            })
            async extendFeature() {
                results.push('extended');
            }
        }


        const myContainer = new customContainer();
        const concept = new A_Concept({
            containers: [myContainer]
        });

        await concept.start();

        expect(results).toEqual(['started', 'extended']);
    });


    // ──────────────────────────────────────────────────────────────────────
    // Runtime-global container registry
    //
    // Covers:
    //   - A_Context.containers() / A_Context.container(name)
    //   - A_Scope.resolveAll(A_Container)
    //   - A_Scope.resolveOnce(A_Container)
    //
    // These power the cross-container-communication pattern documented in
    // `IDE/a-concept-patterns/src/cross-containers-communication.ts`.
    // ──────────────────────────────────────────────────────────────────────

    describe('Container registry', () => {

        // Reset before each test so containers created by earlier tests
        // (including the outer-describe smoke tests) do not leak into the
        // global A_Context.containers() registry.
        beforeEach(() => {
            A_Context.reset();
        });
        afterEach(() => {
            A_Context.reset();
        });


        it('Should register a container in A_Context.containers() on construction', () => {
            const container = new A_Container();

            const all = A_Context.containers();

            expect(all).toContain(container);
            expect(all.length).toBe(1);
        });

        it('Should enumerate all live containers regardless of concept membership', () => {
            const a = new A_Container({ name: 'a' });
            const b = new A_Container({ name: 'b' });
            const c = new A_Container({ name: 'c' });

            const all = A_Context.containers();

            expect(all).toEqual(expect.arrayContaining([a, b, c]));
            expect(all.length).toBe(3);
        });

        it('Should filter containers by concrete subclass when a constructor is passed', () => {
            class HttpContainer extends A_Container {}
            class WorkerContainer extends A_Container {}

            const http = new HttpContainer({ name: 'http' });
            const worker = new WorkerContainer({ name: 'worker' });
            const plain = new A_Container({ name: 'plain' });

            expect(A_Context.containers(HttpContainer)).toEqual([http]);
            expect(A_Context.containers(WorkerContainer)).toEqual([worker]);
            expect(A_Context.containers(A_Container)).toEqual(
                expect.arrayContaining([http, worker, plain])
            );
            expect(A_Context.containers(A_Container).length).toBe(3);
        });

        it('Should also match descendant constructors when filtering by a parent class', () => {
            class BaseContainer extends A_Container {}
            class ChildContainer extends BaseContainer {}

            const base = new BaseContainer({ name: 'base' });
            const child = new ChildContainer({ name: 'child' });

            const bases = A_Context.containers(BaseContainer);
            expect(bases).toEqual(expect.arrayContaining([base, child]));
            expect(bases.length).toBe(2);
        });

        it('Should remove a container from the registry on A_Context.deallocate', () => {
            const container = new A_Container({ name: 'short-lived' });

            expect(A_Context.containers()).toContain(container);

            A_Context.deallocate(container);

            expect(A_Context.containers()).not.toContain(container);
        });

        it('Should look up a container by name via A_Context.container(name)', () => {
            const server = new A_Container({ name: 'server' });
            const worker = new A_Container({ name: 'worker' });

            expect(A_Context.container('server')).toBe(server);
            expect(A_Context.container('worker')).toBe(worker);
            expect(A_Context.container('missing')).toBeUndefined();
        });

        it('Should resolve all containers from any scope via scope.resolveAll(A_Container)', () => {
            const a = new A_Container({ name: 'a' });
            const b = new A_Container({ name: 'b' });

            const detachedScope = new A_Scope({ name: 'detached' });
            const resolved = detachedScope.resolveAll(A_Container);

            expect(resolved).toEqual(expect.arrayContaining([a, b]));
            expect(resolved.length).toBe(2);
        });

        it('Should resolve only matching subclass containers via scope.resolveAll(SubContainer)', () => {
            class ServerContainer extends A_Container {}
            class ClientContainer extends A_Container {}

            const server = new ServerContainer({ name: 'server' });
            const client = new ClientContainer({ name: 'client' });

            const scope = new A_Scope({ name: 'lookup' });

            expect(scope.resolveAll(ServerContainer)).toEqual([server]);
            expect(scope.resolveAll(ClientContainer)).toEqual([client]);
        });

        it('Should enable the canonical cross-container lookup-by-name pattern', () => {
            class ServerContainer extends A_Container {}
            class ClientContainer extends A_Container {}

            const server = new ServerContainer({ name: 'server' });
            const client = new ClientContainer({ name: 'client' });

            // From the client's own scope, find a sibling container by name —
            // the verbatim pattern from cross-containers-communication.ts.
            const peers = client.scope.resolveAll(A_Container);
            const peerServer = peers.find(c => c.name === 'server');

            expect(peerServer).toBe(server);
        });

        it('Should return an empty array when no container of the requested type exists', () => {
            class NeverInstantiated extends A_Container {}

            new A_Container({ name: 'plain' });

            const scope = new A_Scope({ name: 'lookup' });
            expect(scope.resolveAll(NeverInstantiated)).toEqual([]);
        });

        it('Should resolve the first matching container via scope.resolveOnce(A_Container)', () => {
            class HttpContainer extends A_Container {}

            const http = new HttpContainer({ name: 'http' });

            const scope = new A_Scope({ name: 'lookup' });
            expect(scope.resolveOnce(HttpContainer)).toBe(http);
        });

        it('Should return undefined from resolveOnce when no container matches', () => {
            class MissingContainer extends A_Container {}

            const scope = new A_Scope({ name: 'lookup' });
            expect(scope.resolveOnce(MissingContainer)).toBeUndefined();
        });

        it('Should expose all containers attached to a concept via the registry', async () => {
            class AppContainer extends A_Container {}
            class AgentContainer extends A_Container {}

            const app = new AppContainer({ name: 'app' });
            const agent = new AgentContainer({ name: 'agent' });

            const concept = new A_Concept({
                name: 'two-container-concept',
                containers: [app, agent],
            });

            // No load/start needed — registration happens at A_Container
            // construction time via A_Context.allocate().
            expect(A_Context.containers()).toEqual(expect.arrayContaining([app, agent]));

            // And both sides can resolve each other by name from their own scope.
            expect(
                app.scope.resolveAll(A_Container).find(c => c.name === 'agent')
            ).toBe(agent);
            expect(
                agent.scope.resolveAll(A_Container).find(c => c.name === 'app')
            ).toBe(app);

            // Silence "unused" warnings for the concept under noUnusedLocals.
            expect(concept).toBeInstanceOf(A_Concept);
        });

    });

});
