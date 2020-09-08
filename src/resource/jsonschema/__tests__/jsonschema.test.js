import { upperFirst } from 'lodash';

import JSONSchemaResource from '../index';

describe('JSONSchemaResource', () => {
    let resource;
    const SCHEMA = {
        id: 'name',
        type: 'object',
        properties: {
            boolean: {
                type: 'boolean',
            },
            date: {
                type: 'string',
                format: 'date-time',
            },
            nullableString: {
                type: ['string', null],
            },
            string: {
                type: 'string',
            },
            uuid: {
                type: 'string',
                format: 'uuid',
            },
        },
        required: [
            'nullableString',
        ],
    };

    beforeEach(() => {
        resource = new JSONSchemaResource(SCHEMA);
    });

    describe('properties', () => {
        it('proxies to the schema', () => {
            expect(resource.id).toEqual(upperFirst(SCHEMA.id));
            expect(resource.properties).toEqual(SCHEMA.properties);
            expect(resource.required).toEqual(SCHEMA.required);
            expect(resource.type).toEqual(SCHEMA.type);
            expect(resource.keys).toEqual(Object.keys(SCHEMA.properties));
        });
    });

    describe('build()', () => {
        it('converts to version 2.0', () => {
            const openapi = resource.build('2.0');
            expect(openapi).toEqual({
                type: 'object',
                properties: {
                    boolean: {
                        type: 'boolean',
                        'x-nullable': false,
                    },
                    date: {
                        type: 'string',
                        format: 'date-time',
                        'x-nullable': false,
                    },
                    nullableString: {
                        type: 'string',
                        'x-nullable': true,
                    },
                    string: {
                        type: 'string',
                        'x-nullable': false,
                    },
                    uuid: {
                        format: 'uuid',
                        type: 'string',
                        'x-nullable': false,
                    },
                },
                required: [
                    'nullableString',
                ],
            });
        });
        it('converts to version 3.0.0', () => {
            const openapi = resource.build('3.0.0');
            expect(openapi).toEqual({
                type: 'object',
                properties: {
                    boolean: {
                        type: 'boolean',
                        nullable: false,
                    },
                    date: {
                        type: 'string',
                        format: 'date-time',
                        nullable: false,
                    },
                    nullableString: {
                        type: 'string',
                        nullable: true,
                    },
                    string: {
                        type: 'string',
                        nullable: false,
                    },
                    uuid: {
                        format: 'uuid',
                        nullable: false,
                        type: 'string',
                    },
                },
                required: [
                    'nullableString',
                ],
            });
        });
    });

    describe('castInput()', () => {
        it('preserves unmapped properties', () => {
            const data = {
                nullableString: null,
                foo: 'bar',
            };
            const input = resource.castInput(data);
            expect(input).toEqual({
                nullableString: null,
                foo: 'bar',
            });
        });
        it('converts mapped properties', () => {
            const now = new Date();
            const data = {
                boolean: 'false',
                date: now.toISOString(),
                nullableString: 'value',
            };
            const input = resource.castInput(data);
            expect(input).toEqual({
                boolean: false,
                date: now,
                nullableString: 'value',
            });
        });
    });

    describe('castOutput()', () => {
        it('undefines unmapped properties', () => {
            const data = {
                nullableString: null,
                foo: 'bar',
            };
            const output = resource.castOutput(data);
            expect(output).toEqual({
                nullableString: null,
            });
        });
        it('converts mapped properties', () => {
            const now = new Date();
            const data = {
                boolean: false,
                date: now,
                nullableString: 'value',
            };
            const output = resource.castOutput(data);
            expect(output).toEqual({
                boolean: false,
                date: now.toISOString(),
                nullableString: 'value',
            });
        });
    });

    describe('validate()', () => {
        it('throws validation error for invalid data', () => {
            const data = {};
            expect(() => resource.validate(data)).toThrow(
                /requires property "nullableString"/,
            );
        });
        it('throw validation error for custom format', () => {
            const data = {
                nullableString: 'bar',
                uuid: 'foo',
            };
            expect(() => resource.validate(data)).toThrow(
                /instance.uuid does not conform to the "uuid" format/,
            );
        });
        it('does not throw error for valid data', () => {
            const data = {
                nullableString: 'bar',
                uuid: '00000000-0000-4000-9000-000000000000',
            };
            expect(resource.validate(data)).toEqual({
                nullableString: 'bar',
                uuid: '00000000-0000-4000-9000-000000000000',
            });
        });
    });
});
