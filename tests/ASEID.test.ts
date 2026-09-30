import { A_CONSTANTS__DEFAULT_ENV_VARIABLES } from "@adaas/a-concept/constants/env.constants";
import { A_Context } from '@adaas/a-concept/a-context';
import { ASEID } from "@adaas/a-concept/aseid";

jest.retryTimes(0);

describe('ASEID Tests', () => {
    it('Should allow to create a new ASEID object with all parameters', async () => {
        const aseid = new ASEID({
            concept: 'my-concept',
            scope: 'my-scope',
            entity: 'my-entity',
            id: '123',
            version: 'v1',
            shard: 'shard1'
        });

        expect(aseid.concept).toBe('my-concept');
        expect(aseid.scope).toBe('my-scope');
        expect(aseid.entity).toBe('my-entity');
        expect(aseid.id).toBe('123');
        expect(aseid.version).toBe('v1');
        expect(aseid.shard).toBe('shard1');
        expect(aseid.toString()).toBe('my-concept@my-scope:my-entity:shard1.123@v1');
    });
      it('Should allow to create a new ASEID and use hash for identity', async () => {
        const aseid1 = new ASEID({
            concept: 'my-concept',
            scope: 'my-scope',
            entity: 'my-entity',
            id: '123',
            version: 'v1',
            shard: 'shard1'
        });

        const aseid2 = new ASEID({
            concept: 'my-concept',
            scope: 'my-scope',
            entity: 'my-entity',
            id: '123',
            version: 'v1',
            shard: 'shard1'
        });

        const aseid3 = new ASEID({
            concept: 'my-concept',
            scope: 'my-scope',
            entity: 'my-entity',
            id: '124',
            version: 'v1',
            shard: 'shard1'
        });

        expect(aseid1.hash).toBeDefined();
        expect(aseid2.hash).toBeDefined();
        expect(aseid3.hash).toBeDefined();

        expect(aseid1.hash).not.toBe(aseid3.hash);
        expect(aseid1.hash).toBe(aseid2.hash);  
    });
    it('Should allow to create a new ASEID object with required parameters only', async () => {
        const aseid = new ASEID({
            entity: 'my-entity',
            id: 123,
        });

        expect(aseid.concept).toBe('a-concept');
        expect(aseid.scope).toBe('root');
        expect(aseid.entity).toBe('my-entity');
        expect(aseid.id).toBe('0000000123');
        expect(aseid.version).toBeUndefined();
        expect(aseid.shard).toBeUndefined();
        expect(aseid.toString()).toBe('a-concept@root:my-entity:0000000123');
    });
    it('Should allow to create a new ASEID object from string', async () => {
        const aseid = new ASEID('my-concept@my-scope:my-entity:shard1.123@v1');

        expect(aseid.concept).toBe('my-concept');
        expect(aseid.scope).toBe('my-scope');
        expect(aseid.entity).toBe('my-entity');
        expect(aseid.id).toBe('123');
        expect(aseid.version).toBe('v1');
        expect(aseid.shard).toBe('shard1');
        expect(aseid.toString()).toBe('my-concept@my-scope:my-entity:shard1.123@v1');
    });
    it('Should allow to create with Custom Env Variables', async () => {
        process.env[A_CONSTANTS__DEFAULT_ENV_VARIABLES.A_CONCEPT_NAME] = 'my-project';
        process.env[A_CONSTANTS__DEFAULT_ENV_VARIABLES.A_CONCEPT_ROOT_SCOPE] = 'my-scope';

        A_Context.reset();

        const aseid = new ASEID({
            entity: 'my-entity',
            id: 123,
        });

        expect(aseid.concept).toBe('my-project');
        expect(aseid.scope).toBe('my-scope');
        expect(aseid.entity).toBe('my-entity');
        expect(aseid.id).toBe('0000000123');
        expect(aseid.version).toBeUndefined();
        expect(aseid.shard).toBeUndefined();
        expect(aseid.toString()).toBe('my-project@my-scope:my-entity:0000000123');

        delete process.env[A_CONSTANTS__DEFAULT_ENV_VARIABLES.A_CONCEPT_NAME];
        delete process.env[A_CONSTANTS__DEFAULT_ENV_VARIABLES.A_CONCEPT_ROOT_SCOPE];
    });

    it('Should accept "_" in every part and round-trip through the string form', async () => {
        const aseid = new ASEID({
            concept: 'my_concept',
            scope: 'my_scope',
            entity: 'my_entity',
            id: 'wf_abc123',
        });

        const str = aseid.toString();
        expect(str).toBe('my_concept@my_scope:my_entity:wf_abc123');
        expect(ASEID.isASEID(str)).toBe(true);

        const parsed = new ASEID(str);
        expect(parsed.id).toBe('wf_abc123');
        expect(parsed.entity).toBe('my_entity');
        expect(ASEID.compare(aseid, str)).toBe(true);
    });

    it('Should reject "|" and other invalid characters', async () => {
        expect(ASEID.isASEID('my|concept@scope:entity:id')).toBe(false);
        expect(ASEID.isASEID('concept@scope:entity:i|d')).toBe(false);
        expect(ASEID.isASEID('concept@scope:entity:id@v1|2')).toBe(false);

        expect(() => new ASEID({ entity: 'entity', id: 'a|b' })).toThrow();
        expect(() => new ASEID({ entity: 'ent:ity', id: 'abc' })).toThrow();
        expect(() => new ASEID({ entity: 'entity', id: 'abc', shard: 's@1' })).toThrow();
        expect(() => new ASEID({ entity: 'entity', id: 'a.b' })).toThrow();
    });

    it('Should accept "." in the entity (e.g. event attributes like keydown.enter)', async () => {
        const aseid = new ASEID({ concept: 'c', scope: 's', entity: 'keydown.enter', id: 'abc' });
        const parsed = new ASEID(aseid.toString());

        expect(ASEID.isASEID(aseid.toString())).toBe(true);
        expect(parsed.entity).toBe('keydown.enter');
        expect(parsed.id).toBe('abc');
    });
});