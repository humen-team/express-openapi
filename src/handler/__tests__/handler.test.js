import { Handler } from '..';
import { JSONSchemaResource, InternalServerError, UnprocessableEntity } from '../..';

describe('handler', () => {
    const schema = new JSONSchemaResource({
        id: 'Resource',
        properties: {
            flag: {
                type: 'boolean',
            },
            items: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                        },
                    },
                },
            },
        },
        required: [
            'flag',
        ],
    });
    const error = new JSONSchemaResource({
        id: 'Error',
        properties: {
            message: {
                type: 'string',
            },
            status: {
                type: 'integer',
            },
        },
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
            const data = {
                flag: true,
            };
            const result = handler.processInputData(data);
            expect(result).toEqual({
                flag: true,
            });
        });
        it('validates the request body', async () => {
            const handler = new Handler({
                input: schema,
            });
            const data = {
            };
            await expect(() => handler.processInputData(data)).toThrow(UnprocessableEntity);
        });
        it('validates unexpected attributes', async () => {
            const handler = new Handler({
                input: schema,
            });
            const data = {
                flag: false,
                foo: 'bar',
            };
            await expect(() => handler.processInputData(data)).toThrow(UnprocessableEntity);
        });
    });

    describe('processOutputData', () => {
        it('processes the output data', () => {
            const handler = new Handler({
                output: schema,
            });
            const data = {
                flag: true,
            };
            const result = handler.processOutputData(data);
            expect(result).toEqual({
                flag: true,
            });
        });
        it('validates the output data', async () => {
            const handler = new Handler({
                output: schema,
            });
            const data = {
            };
            expect(() => handler.processOutputData(data)).toThrow(InternalServerError);
        });
        it('ignores unmapped properties', async () => {
            const handler = new Handler({
                output: schema,
            });
            const data = {
                flag: true,
                foo: 'bar',
                items: [
                    {
                        name: 'name',
                        // XXX TODO: fix resource castOutput
                        bar: undefined,
                    },
                ],
            };
            const result = handler.processOutputData(data);
            expect(result).toEqual({
                flag: true,
                items: [
                    {
                        name: 'name',
                    },
                ],
            });
        });
    });
    describe('processErrorData', () => {
        it('processes the error data', () => {
            const handler = new Handler({
                error,
            });
            const data = {
                message: 'an error',
                extra: 'ignore me',
            };
            const result = handler.processErrorData(data);
            expect(result).toEqual({
                message: 'an error',
            });
        });
    });
});
