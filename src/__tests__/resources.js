import { JSONSchemaResource } from '..';

export const Foo = new JSONSchemaResource({
    id: 'Foo',
    type: 'object',
    properties: {
        bar: {
            type: 'string',
        },
        id: {
            type: 'string',
        },
    },
    required: [
        'bar',
        'id',
    ],
});

export const FooList = Foo.toList();

export const CreateFoo = Foo.omit({
    id: 'CreateFoo',
    properties: ['id'],
});
export const ReplaceFoo = Foo.omit({
    id: 'ReplaceFoo',
    properties: ['id'],
});
export const UpdateFoo = Foo.omit({
    id: 'UpdateFoo',
    properties: ['id'],
});

export const CountFoo = new JSONSchemaResource({
    id: 'CountFoo',
    type: 'object',
    properties: {
    },
});

export const SearchFoo = new JSONSchemaResource({
    id: 'SearchFoo',
    type: 'object',
    properties: {
        offset: {
            default: 0,
            type: 'integer',
        },
        limit: {
            type: 'integer',
        },
    },
});

export const FooFile = new JSONSchemaResource({
    id: 'FooFile',
    type: 'object',
    properties: {
        id: {
            type: 'string',
        },
    },
    required: [
        'id',
    ],
});

export const CommandInput = new JSONSchemaResource({
    id: 'CommandInput',
    type: 'object',
    properties: {
        request: {
            type: 'string',
        },
    },
    required: [
        'request',
    ],
});

export const CommandOutput = new JSONSchemaResource({
    id: 'CommandOutput',
    type: 'object',
    properties: {
        response: {
            type: 'string',
        },
    },
    required: [
        'response',
    ],
});

export const QueryInput = new JSONSchemaResource({
    id: 'QueryInput',
    type: 'object',
    properties: {
        request: {
            type: 'string',
        },
    },
    required: [
        'request',
    ],
});

export const QueryOutput = new JSONSchemaResource({
    id: 'QueryOutput',
    type: 'object',
    properties: {
        response: {
            type: 'string',
        },
    },
    required: [
        'response',
    ],
});
