import { merge, omit } from 'lodash';

import Reference from '../reference';
import { OPENAPI_2_0 } from '../../constants';

/* Does this schema have a nullable type?
 */
export function isNullable(schema) {
    const { type } = schema;
    return type === 'null' || (type?.includes && type.includes(null));
}

/* Build a schema property as valid OpenAPI.
 */
export function buildProperty(schema, openapiVersion) {
    const { items, type } = schema;
    const nullable = openapiVersion === OPENAPI_2_0 ? 'x-nullable' : 'nullable';

    // special case #1: nullability is encoded differently
    const converted = {
        [nullable]: isNullable(schema),
    };

    // special case #2: types cannot be lists or contain `null`
    converted.type = type?.filter
        ? type.filter((item) => item !== null)[0]
        : type;

    // special case #3: items is a reference to another part of the document
    if (items instanceof Reference) {
        converted.items = items.build(openapiVersion);
    } else {
        converted.items = items;
    }

    return merge(
        omit(schema, ['items', 'type']),
        converted,
    );
}
