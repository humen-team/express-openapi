/* Define a type (Parent) with a reference to another type (Child).
 */
import { JSONSchemaResource } from '..';

export const Grandchild = JSONSchemaResource.all({
    id: 'Grandchild',
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
            $ref: Grandchild.toRef(),
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
            $ref: Child.toRef(),
        },
        name: {
            type: 'string',
        },
    },
});
