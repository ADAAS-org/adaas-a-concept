import { A_Fragment } from "@adaas/a-concept/global/A-Fragment/A-Fragment.class";

jest.retryTimes(0);

describe('A-Fragment Tests', () => {

    it('It Should be possible to create an A_Fragment instance', async () => {

        const fragment = new A_Fragment();

        expect(fragment).toBeDefined();
        expect(fragment.name).toBe('A_Fragment');
        expect(fragment.size()).toBe(0);
    });

    it('It Should be possible to create an A_Fragment instance with custom name', async () => {

        const fragment = new A_Fragment({ name: 'CustomFragment' });

        expect(fragment).toBeDefined();
        expect(fragment.name).toBe('CustomFragment');
        expect(fragment.size()).toBe(0);
    });

    it('It Should be possible to create a typed A_Fragment instance', async () => {

        const fragment = new A_Fragment<{ userId: string; role: string }>({
            name: 'UserFragment'
        });

        expect(fragment).toBeDefined();
        expect(fragment.name).toBe('UserFragment');
        expect(fragment.size()).toBe(0);
    });

    it('It Should be possible to store and retrieve data from fragment meta', async () => {

        const fragment = new A_Fragment<{ userId: string; role: string }>({
            name: 'UserFragment'
        });

        fragment.set('userId', '12345');
        fragment.set('role', 'admin');

        expect(fragment.get('userId')).toBe('12345');
        expect(fragment.get('role')).toBe('admin');
        expect(fragment.has('userId')).toBe(true);
        expect(fragment.has('role')).toBe(true);
        expect(fragment.size()).toBe(2);
    });

    it('It Should be possible to check if keys exist in fragment meta', async () => {

        const fragment = new A_Fragment<{ test: string; value: number }>();

        expect(fragment.has('test')).toBe(false);
        expect(fragment.has('value')).toBe(false);

        fragment.set('test', 'hello');

        expect(fragment.has('test')).toBe(true);
        expect(fragment.has('value')).toBe(false);
    });

    it('It Should be possible to get all keys from fragment meta', async () => {

        const fragment = new A_Fragment<{ userId: string; role: string; lastLogin: Date }>();

        fragment.set('userId', '12345');
        fragment.set('role', 'admin');

        const keys = fragment.keys();

        expect(keys).toContain('userId');
        expect(keys).toContain('role');
        expect(keys).not.toContain('lastLogin');
        expect(keys.length).toBe(2);
    });

    it('It Should be possible to set multiple values at once', async () => {

        const fragment = new A_Fragment<{ userId: string; role: string; isActive: boolean }>();

        fragment.setMultiple({
            userId: '12345',
            role: 'admin',
            isActive: true
        });

        expect(fragment.get('userId')).toBe('12345');
        expect(fragment.get('role')).toBe('admin');
        expect(fragment.get('isActive')).toBe(true);
        expect(fragment.size()).toBe(3);
    });

    it('It Should be possible to drop specific keys from fragment meta', async () => {

        const fragment = new A_Fragment<{ userId: string; role: string; temp: string }>();

        fragment.set('userId', '12345');
        fragment.set('role', 'admin');
        fragment.set('temp', 'temporary');

        expect(fragment.size()).toBe(3);

        fragment.drop('temp');

        expect(fragment.has('temp')).toBe(false);
        expect(fragment.has('userId')).toBe(true);
        expect(fragment.has('role')).toBe(true);
        expect(fragment.size()).toBe(2);
    });

    it('It Should be possible to clear all data from fragment meta', async () => {

        const fragment = new A_Fragment<{ userId: string; role: string }>();

        fragment.set('userId', '12345');
        fragment.set('role', 'admin');

        expect(fragment.size()).toBe(2);

        fragment.clear();

        expect(fragment.size()).toBe(0);
        expect(fragment.has('userId')).toBe(false);
        expect(fragment.has('role')).toBe(false);
    });

    it('It Should be possible to clone a fragment with its data', async () => {

        const original = new A_Fragment<{ userId: string; role: string }>({
            name: 'OriginalFragment'
        });

        original.set('userId', '12345');
        original.set('role', 'admin');

        const clone = original.clone('ClonedFragment');

        expect(clone).toBeDefined();
        expect(clone.name).toBe('ClonedFragment');
        expect(clone.get('userId')).toBe('12345');
        expect(clone.get('role')).toBe('admin');
        expect(clone.size()).toBe(2);

        // Verify they are separate instances
        clone.set('userId', '67890');
        expect(original.get('userId')).toBe('12345');
        expect(clone.get('userId')).toBe('67890');
    });

    it('It Should be possible to clone a fragment with auto-generated name', async () => {

        const original = new A_Fragment<{ test: string }>({
            name: 'TestFragment'
        });

        original.set('test', 'value');

        const clone = original.clone();

        expect(clone.name).toBe('TestFragment_copy');
        expect(clone.get('test')).toBe('value');
    });

    it('It Should be possible to serialize a fragment to JSON', async () => {

        const fragment = new A_Fragment<{ userId: string; role: string }>({
            name: 'UserFragment'
        });

        fragment.set('userId', '12345');
        fragment.set('role', 'admin');

        const json = fragment.toJSON();

        expect(json).toBeDefined();
        expect(json.name).toBe('UserFragment');
        expect(json.userId).toBe('12345');
        expect(json.role).toBe('admin');
    });

    it('It Should be possible to create an inherited A_Fragment instance', async () => {
        
        class CustomFragment extends A_Fragment<{ sessionId: string; timestamp: number }> {
            constructor() {
                super({ name: 'CustomFragment' });
            }

            getSessionInfo(): string {
                const sessionId = this.get('sessionId') || 'unknown';
                const timestamp = this.get('timestamp') || 0;
                return `${sessionId}-${timestamp}`;
            }
        }

        const fragment = new CustomFragment();

        expect(fragment).toBeDefined();
        expect(fragment.name).toBe('CustomFragment');
        expect(fragment instanceof A_Fragment).toBe(true);
        expect(fragment instanceof CustomFragment).toBe(true);

        fragment.set('sessionId', 'sess123');
        fragment.set('timestamp', 1698765432);

        expect(fragment.getSessionInfo()).toBe('sess123-1698765432');
    });

    it('It Should be possible to create a fragment with custom serialization', async () => {
        
        class SessionFragment extends A_Fragment<
            { sessionId: string; timestamp: number },
            { name: string; sessionData: string }
        > {
            constructor() {
                super({ name: 'SessionFragment' });
            }

            toJSON(): { name: string; sessionData: string } {
                const sessionId = this.get('sessionId') || 'unknown';
                const timestamp = this.get('timestamp') || 0;
                return {
                    name: this.name,
                    sessionData: `${sessionId}-${timestamp}`
                };
            }
        }

        const fragment = new SessionFragment();
        fragment.set('sessionId', 'sess123');
        fragment.set('timestamp', 1698765432);

        const json = fragment.toJSON();

        expect(json).toBeDefined();
        expect(json.name).toBe('SessionFragment');
        expect(json.sessionData).toBe('sess123-1698765432');
        expect(json).not.toHaveProperty('sessionId');
        expect(json).not.toHaveProperty('timestamp');
    });

    it('It Should be possible to access the underlying meta object', async () => {

        const fragment = new A_Fragment<{ test: string; value: number }>();

        expect(fragment.meta).toBeDefined();
        expect(fragment.meta.size()).toBe(0);

        fragment.set('test', 'hello');
        fragment.set('value', 42);

        expect(fragment.meta.size()).toBe(2);
        expect(fragment.meta.has('test')).toBe(true);
        expect(fragment.meta.get('test')).toBe('hello');
    });

    it('It Should handle undefined values correctly', async () => {

        const fragment = new A_Fragment<{ optional?: string; required: string }>();

        expect(fragment.get('optional')).toBeUndefined();
        expect(fragment.get('required')).toBeUndefined();

        fragment.set('required', 'value');

        expect(fragment.get('required')).toBe('value');
        expect(fragment.get('optional')).toBeUndefined();
        expect(fragment.has('required')).toBe(true);
        expect(fragment.has('optional')).toBe(false);
    });

    it('It Should handle setMultiple with undefined values correctly', async () => {

        const fragment = new A_Fragment<{ a?: string; b?: number; c: boolean }>();

        fragment.setMultiple({
            a: 'test',
            b: undefined, // Should be ignored
            c: true
        });

        expect(fragment.has('a')).toBe(true);
        expect(fragment.has('b')).toBe(false);
        expect(fragment.has('c')).toBe(true);
        expect(fragment.size()).toBe(2);
    });

});