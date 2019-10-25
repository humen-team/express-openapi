import { get, mapValues } from 'lodash';

/* Map a function over an object and a schema.
 */
export default function mapSchema(value, schema, registry, func, path = '') {
    if (!schema) {
        return func(value, null);
    }

    const { $ref, type } = schema;

    if ($ref) {
        // XXX resolved Reference
        return mapSchema(
            value,
            registry[$ref],
            registry,
            func,
            `${path}.$ref`,
        );
    }

    if (type === 'array') {
        return value.map(
            (child) => mapSchema(
                child,
                get(schema, 'items'),
                registry,
                func,
                `${path}.items`,
            ),
        );
    }

    if (type === 'object') {
        return mapValues(
            value,
            (child, key) => mapSchema(
                child,
                get(schema, `properties.${key}`),
                registry,
                func,
                `${path}.properties.${key}`,
            ),
        );
    }

    return func(value, schema);
}
