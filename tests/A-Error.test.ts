import { A_CONSTANTS__DEFAULT_ENV_VARIABLES } from "@adaas/a-concept/constants/env.constants";
import { A_Context } from "@adaas/a-concept/a-context";
import {
    A_Error,
    A_CONSTANTS__ERROR_CODES, 
    A_CONSTANTS__ERROR_DESCRIPTION
} from "@adaas/a-concept/a-error";
import { A_FormatterHelper} from "@adaas/a-concept/helpers/A_Formatter.helper";

jest.retryTimes(0);

describe('A-Error Tests', () => {

    it('It Should be possible to create an A_Error instance', async () => {

        const error = new A_Error('Test error');

        expect(error).toBeDefined();
        expect(error.message).toBe('Test error');
        expect(error.title).toBe(A_CONSTANTS__ERROR_CODES.UNEXPECTED_ERROR);
        expect(error.code).toBe(A_FormatterHelper.toKebabCase(A_CONSTANTS__ERROR_CODES.UNEXPECTED_ERROR));
        expect(error.type).toBe('a-error');
    });

    it('It Should be possible to create an A_Error instance from another error', async () => {

        const originalError = new Error('Original error');
        const error = new A_Error(originalError);

        expect(error).toBeDefined();
        expect(error.message).toBe('Original error');
        expect(error.title).toBe(A_CONSTANTS__ERROR_CODES.UNEXPECTED_ERROR);
        expect(error.code).toBe(A_FormatterHelper.toKebabCase(A_CONSTANTS__ERROR_CODES.UNEXPECTED_ERROR));
        expect(error.type).toBe('a-error');
        expect(error.originalError).toBe(originalError);
    });

    it('It Should be possible to create an A_Error instance from another A_Error', async () => {

        const originalError = new A_Error('Original A_Error', 'This is the original error');
        const error = new A_Error(originalError);

        expect(error).toBeDefined();
        expect(error).toBe(originalError);
        expect(error.title).toBe('Original A_Error');
        expect(error.message).toBe('[Original A_Error]: This is the original error');
        expect(error.code).toBe('original-a-error');
        expect(error.type).toBe('a-error');
        expect(error.description).toBe('This is the original error');
        expect(error.originalError).toBeUndefined()

    });
    it('It Should be possible to create an A_Error instance from another A_Error with custom code and description', async () => {

        const originalError = new A_Error('Original A_Error', 'This is the original error');
        const error = new A_Error({
            code: 'test-code',
            title: 'Custom error message',
            description: 'This is a custom error description',
            originalError
        });

        expect(error).toBeDefined();
        expect(error.title).toBe('Custom error message');
        expect(error.message).toBe('[Custom error message]: This is a custom error description');
        expect(error.code).toBe('test-code');
        expect(error.type).toBe('a-error');
        expect(error.description).toBe('This is a custom error description');
        expect(error.originalError).toBe(originalError);
    });

    it('It Should be possible to create an A_Error instance from another A_Error with only custom message', async () => {

        const originalError = new A_Error('Original A_Error', 'This is the original error');

        const error = new A_Error({
            title: 'Custom error message',
            originalError: originalError
        });

        expect(error).toBeDefined();
        expect(error.title).toBe('Custom error message');
        expect(error.message).toBe('Custom error message');
        expect(error.code).toBe('custom-error-message');
        expect(error.type).toBe('a-error');
        expect(error.description).toBe(A_CONSTANTS__ERROR_DESCRIPTION);
        expect(error.originalError).toBe(originalError);
    });

    it('It Should be possible to create an inherited A_Error instance', async () => {
        class MyError extends A_Error { }

        const error = new MyError('Test inherited error');

        expect(error).toBeDefined();
        expect(error.title).toBe(A_CONSTANTS__ERROR_CODES.UNEXPECTED_ERROR);
        expect(error.code).toBe(A_FormatterHelper.toKebabCase(A_CONSTANTS__ERROR_CODES.UNEXPECTED_ERROR));
        expect(error.message).toBe('Test inherited error');
        expect(error.type).toBe('my-error');
    });

    it('It should be possible to serialize  an A_Error instance', async () => {

        const originalError = new A_Error('Original A_Error', 'This is the original error');

        expect(originalError.title).toBe('Original A_Error');


        const error = new A_Error(originalError);

        const serialized = error.toJSON();

        expect(serialized).toBeDefined();
        expect(serialized.title).toBe('Original A_Error');
        expect(serialized.message).toBe('[Original A_Error]: This is the original error');
        expect(serialized.code).toBe('original-a-error');
        expect(serialized.type).toBe('a-error');
        expect(serialized.scope).toBe('root');
        expect(serialized.description).toBe('This is the original error');
        expect(serialized.originalError).toBeUndefined();
    });

    it('It should be possible to change scope and concept via ENV variables', async () => {
        process.env[A_CONSTANTS__DEFAULT_ENV_VARIABLES.A_CONCEPT_NAME] = 'my-project';
        process.env[A_CONSTANTS__DEFAULT_ENV_VARIABLES.A_CONCEPT_ROOT_SCOPE] = 'my-scope';

        A_Context.reset();

        const error = new A_Error('Test error in custom concept and scope');

        expect(error).toBeDefined();
        expect(error.message).toBe('Test error in custom concept and scope');
        expect(error.title).toBe(A_CONSTANTS__ERROR_CODES.UNEXPECTED_ERROR);
        expect(error.code).toBe(A_FormatterHelper.toKebabCase(A_CONSTANTS__ERROR_CODES.UNEXPECTED_ERROR));
        expect(error.type).toBe('a-error');
        expect(error.aseid.concept).toBe('my-project');
        expect(error.aseid.scope).toBe('my-scope');
        expect(error.scope).toBe('my-scope');

        // Reset env variables
        process.env[A_CONSTANTS__DEFAULT_ENV_VARIABLES.A_CONCEPT_NAME] = undefined;
        process.env[A_CONSTANTS__DEFAULT_ENV_VARIABLES.A_CONCEPT_ROOT_SCOPE] = undefined;
    });

});
