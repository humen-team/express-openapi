import JSONSchemaResource from '../index';

describe('JSONSchemaResource', () => {
    const SCHEMA = {
        id: 'name',
        type: 'object',
        properties: {
            foo: {
                type: ['string', null],
            },
        },
        required: [
            'foo',
        ],
    };

    describe('validate()', () => {
        it('throws validation error for invalid data', () => {
            const resource = new JSONSchemaResource(SCHEMA);
            const data = {};
            expect(() => resource.validate(data)).toThrow('requires property "foo"');
        });
        it('does not throw error for valid data', () => {
            const resource = new JSONSchemaResource(SCHEMA);
            const data = {
                foo: 'bar',
            };
            expect(resource.validate(data)).toEqual({ foo: 'bar' });
        });
    });

    describe('build()', () => {
        it('converts to version 2.0', () => {
            const resource = new JSONSchemaResource(SCHEMA);
            const openapi = resource.build('2.0');
            expect(openapi).toEqual({
                type: 'object',
                properties: {
                    foo: {
                        type: 'string',
                        'x-nullable': true,
                    },
                },
                required: [
                    'foo',
                ],
            });
        });
        it('converts to version 3.0.0', () => {
            const resource = new JSONSchemaResource(SCHEMA);
            const openapi = resource.build('3.0.0');
            expect(openapi).toEqual({
                type: 'object',
                properties: {
                    foo: {
                        type: 'string',
                        nullable: true,
                    },
                },
                required: [
                    'foo',
                ],
            });
        });
    });
});
