import JSONSchemaResource from '..';

export const ChildSchema = JSONSchemaResource.all({
    id: 'Child',
    properties: {
        value: {
            type: 'string',
        },
    },
});

export const StringValueSchema = JSONSchemaResource.all({
    id: 'StringValue',
    properties: {
        value: {
            type: 'string',
        },
    },
});

export const StringValueListSchema = JSONSchemaResource.all({
    id: 'StringValueList',
    properties: {
        value: {
            type: 'array',
            items: {
                type: 'string',
            },
        },
    },
});

export const NestedStringValueSchema = JSONSchemaResource.all({
    id: 'NestedStringValue',
    properties: {
        value: {
            type: 'object',
            properties: {
                value: {
                    type: 'string',
                },
                required: [
                    'value',
                ],
            },
        },
    },
});

export const NestedReferenceSchema = JSONSchemaResource.all({
    id: 'NestedReference',
    properties: {
        value: {
            $ref: ChildSchema.toRef(),
        },
    },
});

export const NestedReferenceListSchema = JSONSchemaResource.all({
    id: 'NestedReferenceList',
    properties: {
        value: {
            type: 'array',
            items: {
                $ref: ChildSchema.toRef(),
            },
        },
    },
});
