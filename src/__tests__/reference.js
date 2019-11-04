/* Define a type (Parent) with a reference to another type (Child).
 */
import { JSONSchemaResource } from '..';

export const GrandChild = JSONSchemaResource.all({
    id: 'GrandChild',
    properties: {
        name: {
            type: 'string',
        },
    },
});

export const Child = JSONSchemaResource.all({
    id: 'Child',
    properties: {
        grandchild: {
            anyOf: [
                {
                    $ref: GrandChild.toRef(),
                },
                {
                    type: null,
                },
            ],
        },
        name: {
            type: 'string',
        },
    },
});

export const Parent = JSONSchemaResource.all({
    id: 'Parent',
    properties: {
        child: {
            anyOf: [
                {
                    $ref: Child.toRef(),
                },
                {
                    // XXX The jsonschema library has a bug here that I need to track down.
                    // If we pass `type: null` and have grandchildren, we get an error in which
                    // the library tries to deference the `id` of the `null` schema.
                    //
                    // This only happens when grandchildren are involved, not children alone.
                },
            ],
        },
        name: {
            type: 'string',
        },
    },
});
