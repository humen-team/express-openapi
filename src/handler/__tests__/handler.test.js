import { Handler } from '..';
import { JSONSchemaResource, InternalServerError, UnprocessableEntity } from '../..';

describe('handler', () => {
    const schema = new JSONSchemaResource({
        id: 'resource',
        properties: {
            flag: {
                type: 'boolean',
            },
        },
        required: [
            'flag',
        ],
    });

    describe('processInput', () => {
        it('returns null without an input schema', async () => {
            const handler = new Handler({});
            const req = {};
            const result = await handler.processInput(req);
            expect(result).toBeNull();
        });
        it('processes the request body', async () => {
            const handler = new Handler({
                hasRequestBody: true,
                input: schema,
            });
            const req = {
                body: {
                    flag: true,
                },
            };
            const result = await handler.processInput(req);
            expect(result).toEqual({
                flag: true,
            });
        });
        it('processes the request query string', async () => {
            const handler = new Handler({
                hasRequestBody: false,
                input: schema,
            });
            const req = {
                query: {
                    flag: 'true',
                },
            };
            const result = await handler.processInput(req);
            expect(result).toEqual({
                flag: true,
            });
        });
    });

    describe('processInputData', () => {
        it('processes the input  data', () => {
            const handler = new Handler({
                input: schema,
            });
            const input = {
                flag: true,
            };
            const result = handler.processInputData(input);
            expect(result).toEqual({
                flag: true,
            });
        });
        it('validates the request body', async () => {
            const handler = new Handler({
                input: schema,
            });
            const input = {
            };
            await expect(() => handler.processInputData(input)).toThrow(UnprocessableEntity);
        });
        it('validates unexpected attributes', async () => {
            const handler = new Handler({
                input: schema,
            });
            const input = {
                flag: false,
                foo: 'bar',
            };
            await expect(() => handler.processInputData(input)).toThrow(UnprocessableEntity);
        });
    });

    describe('processOutputData', () => {
        it('processes the output data', () => {
            const handler = new Handler({
                output: schema,
            });
            const output = {
                flag: true,
            };
            const result = handler.processOutputData(output);
            expect(result).toEqual({
                flag: true,
            });
        });
        it('validates the output data', async () => {
            const handler = new Handler({
                output: schema,
            });
            const output = {
            };
            expect(() => handler.processOutputData(output)).toThrow(InternalServerError);
        });
        it('ignores unmapped properties', async () => {
            const handler = new Handler({
                output: schema,
            });
            const output = {
                flag: true,
                foo: 'bar',
            };
            const result = handler.processOutputData(output);
            expect(result).toEqual({
                flag: true,
            });
        });
    });
});
