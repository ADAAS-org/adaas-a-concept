import './test.setup'
import { A_CommonHelper } from "@adaas/a-concept/helpers/A_Common.helper";
import { A_IdentityHelper } from "@adaas/a-concept/helpers/A_Identity.helper";
import { A_TYPES__DeepPartial } from "@adaas/a-concept/types/A_Common.types";
jest.retryTimes(0);

describe('A-Common Tests', () => {
    it('Deep Clone and  Merge ', async () => {

        type TestType = {
            a: string,
            b: string,
            c: {
                d: string
            },
            f: (name: string) => string
            s: Date
        }

        const t: TestType = {
            a: 'a',
            b: 'b',
            c: {
                d: 'd'
            },
            f: (name: string) => { return name },
            s: new Date()
        }

        const t2: A_TYPES__DeepPartial<TestType> = {
            a: 'aa',
            c: {
                d: 'dd'
            },
            f: (name: string) => { return name + '2' }
        }

        const merged = A_CommonHelper.deepCloneAndMerge(t2, t);


        const name = merged.f('names');


        expect(merged.a).toBe('aa');
        expect(merged.b).toBe('b');
        expect(merged.c.d).toBe('dd');
        expect(name).toBe('names2');
        expect(t).not.toEqual(merged);
        expect(t2).not.toEqual(merged);
    });

    it('Deep Clone Different Types', async () => {

        type TestType = {
            a: string,
            b: string,
            c: {
                d: string
            },
            bool:{
                a: boolean
            },
            f: (name: string) => string
            s: Date
        }

        const t: TestType = {
            a: 'a',
            b: 'b',
            c: {
                d: 'd'
            },
            bool:{
                a: true
            },
            f: (name: string) => { return name },
            s: new Date()
        }

        const t2: any = {
            e: 'foo',
            b: 'bb',
            c:{
                d: 'ddd'
            },
            bool:{
                a: false
            },
            some: {
                d: 'dd'
            },
        }

        const merged = A_CommonHelper.deepCloneAndMerge(t2, t);

        expect(merged.a).toBe('a');
        expect(merged.b).toBe('bb');
        expect(merged.c.d).toBe('ddd');
        expect(merged.bool.a).toBe(false);
        expect((merged as any).e).toBe('foo');
        expect((merged as any).some.d).toBe('dd');
        expect(merged.f('names')).toBe('names');
    });
    it('should generate and then parse Unique time based IDs', async () => {
        const id = A_IdentityHelper.generateTimeId();
        const parts = A_IdentityHelper.parseTimeId(id);

        expect(id).toBeDefined();
        expect(parts.timestamp).toBeInstanceOf(Date);
        expect(parts.random).toHaveLength(6);

        // Check that the timestamp is recent (within the last minute)
        const now = Date.now();
        const timestamp = parts.timestamp.getTime();
        expect(timestamp).toBeLessThanOrEqual(now);
        expect(timestamp).toBeGreaterThan(now - 60000); // within the last minute
    });
});