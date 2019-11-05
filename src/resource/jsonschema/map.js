import { get, mapValues } from 'lodash';

import Reference from '../reference';

/* Map a function over an object and a schema.
 */
export default function mapSchema(value, schema, func, path = '') {
    if (!schema) {
        return func(value, null);
    }

    const { $ref, type } = schema;

    if ($ref) {
        if ($ref instanceof Reference) {
            return mapSchema(
                value,
                $ref.resource,
                func,
                `${path}.$ref`,
            );
        }
        throw new Error('Expected $ref to be instance of Reference; did you use Resource.toRef()?');
    }

    if (type === 'array') {
        return value.map(
            (child) => mapSchema(
                child,
                get(schema, 'items'),
                func,
                `${path}.items`,
            ),
        );
    }

    if (type && type === 'object') {
        return mapValues(
            value,
            (child, key) => mapSchema(
                child,
                get(schema, `properties.${key}`),
                func,
                `${path}.properties.${key}`,
            ),
        );
    }

    return func(value, schema);
}
