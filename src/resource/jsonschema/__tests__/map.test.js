import mapSchema from '../map';
import {
    NestedReferenceListSchema,
    NestedReferenceSchema,
    NestedStringValueSchema,
    StringValueSchema,
    StringValueListSchema,
} from './fixtures';

function isDefined(object, schema) {
    return schema !== null;
}

describe('mapSchema', () => {
    describe('StringValueSchema', () => {
        it('maps property values', () => {
            const schema = StringValueSchema;
            const object = {
                additionalProperty: 'additionalProperty',
                value: 'string',
            };
            const mapping = mapSchema(object, schema, isDefined);
            expect(mapping).toEqual({
                additionalProperty: false,
                value: true,
            });
        });
    });
    describe('StringValueListSchema', () => {
        it('maps property values', () => {
            const schema = StringValueListSchema;
            const object = {
                additionalProperty: 'additionalProperty',
                value: [
                    'string1',
                    'string2',
                ],
            };
            const mapping = mapSchema(object, schema, isDefined);
            expect(mapping).toEqual({
                additionalProperty: false,
                value: [
                    true,
                    true,
                ],
            });
        });
    });
    describe('NestedStringValueSchema', () => {
        it('maps property values', () => {
            const schema = NestedStringValueSchema;
            const object = {
                additionalProperty: 'additionalProperty',
                value: {
                    additionalProperty: 'additionalProperty',
                    value: 'string',
                },
            };
            const mapping = mapSchema(object, schema, isDefined);
            expect(mapping).toEqual({
                additionalProperty: false,
                value: {
                    additionalProperty: false,
                    value: true,
                },
            });
        });
    });
    describe('NestedReferenceSchema', () => {
        it('maps property values', () => {
            const schema = NestedReferenceSchema;
            const object = {
                additionalProperty: 'additionalProperty',
                value: {
                    additionalProperty: 'additionalProperty',
                    value: 'string',
                },
            };
            const mapping = mapSchema(object, schema, isDefined);
            expect(mapping).toEqual({
                additionalProperty: false,
                value: {
                    additionalProperty: false,
                    value: true,
                },
            });
        });
    });
    describe('NestedReferenceListSchema', () => {
        it('maps property values', () => {
            const schema = NestedReferenceListSchema;
            const object = {
                additionalProperty: 'additionalProperty',
                value: [{
                    additionalProperty: 'additionalProperty',
                    value: 'string',
                }],
            };
            const mapping = mapSchema(object, schema, isDefined);
            expect(mapping).toEqual({
                additionalProperty: false,
                value: [{
                    additionalProperty: false,
                    value: true,
                }],
            });
        });
    });
});
