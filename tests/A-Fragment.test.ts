import { A_Fragment } from "@adaas/a-concept/a-fragment";

jest.retryTimes(0);

describe('A-Fragment Tests', () => {

    it('It Should be possible to create an A_Fragment instance', async () => {

        const fragment = new A_Fragment();

        expect(fragment).toBeDefined();
        expect(fragment.name).toBe('A_Fragment');
    });

    it('It Should be possible to create an A_Fragment instance with custom name', async () => {

        const fragment = new A_Fragment({ name: 'CustomFragment' });

        expect(fragment).toBeDefined();
        expect(fragment.name).toBe('CustomFragment');
    });
});