import { isPlainObject, mapValues, merge } from 'lodash';

import { OPENAPI_2_0 } from '../../constants';

/* Does this schema have a nullable type?
 */
export function isNullable(object) {
    const { type } = object;
    return type === 'null' || (type?.includes && type.includes(null));
}

/* Build valid OpenAPI from JSON Schema.
 */
export default function buildOpenAPI(object, openapiVersion, path = '') {
    // recurse into lists
    if (Array.isArray(object)) {
        return object.map(
            (item) => buildOpenAPI(item, openapiVersion, `${path}[]`),
        );
    }

    const nullable = openapiVersion === OPENAPI_2_0 ? 'x-nullable' : 'nullable';

    // recurse into objects
    if (isPlainObject(object)) {
        return merge(
            // special case #1: nullability can be encoded
            object.type ? {
                [nullable]: isNullable(object),
            } : {},
            mapValues(
                object,
                (value, key) => {
                    // special case #2: types cannot be lists or contain `null`
                    if (key === 'type' && !isPlainObject(value)) {
                        return value?.filter
                            ? value.filter((item) => item !== null)[0]
                            : value;
                    }
                    // special case #3: items is a reference to another part of the document
                    if (key === '$ref') {
                        return value.build(openapiVersion);
                    }
                    return buildOpenAPI(value, openapiVersion, `${path}.${key}`);
                },
            ),
        );
    }

    // return primitives
    return object;
}
