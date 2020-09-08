import { isPlainObject, mapValues } from 'lodash';
import { Validator } from 'jsonschema';

import Reference from '../reference';
import { userIdFormat, uuidFormat } from './formats';

/* Replace `Reference` instances in the schema with an concrete path.
 *
 * OpenAPI 2.0 and 3.0.0 expect different root paths for resources. We avoid committing
 * to one path or another by using a `Reference` object instance and deferring spec building
 * until as late as possible.
 *
 * However, internal references may be needed for resource validation, so we replace
 * `Reference` instances with a _generic_ path during validation.
 */
function dereference(object, validator, path = '') {
    // recurse into lists
    if (Array.isArray(object)) {
        return object.map(
            (item) => dereference(item, validator, `${path}[]`),
        );
    }

    // recurse into objects
    if (isPlainObject(object)) {
        return mapValues(
            object,
            (value, key) => {
                if (key !== '$ref') {
                    // not a ref
                    return dereference(value, validator, `${path}.${key}`);
                }
                if (!(value instanceof Reference)) {
                    // not a valid ref
                    throw new Error('Expected $ref to be instance of Reference; did you use Resource.toRef()?');
                }
                // use '/foo' as the generic reference path
                const refId = value.id;

                // recurse to the referenced schema
                const { id, ...referenceSchema } = dereference(value.resource.schema, validator);

                // save the reference schema under the reference id *locally* within this validator.
                validator.addSchema({ id: refId, ...referenceSchema });

                // return the generic reference path in place of the Reference
                return refId;
            },
        );
    }

    // base case
    return object;
}

/* Create a JSON Schema validator for a specific resource.
 */
export default function createValidator(resource) {
    const validator = new Validator();

    validator.customFormats.uuid = uuidFormat;
    validator.customFormats['user-id'] = userIdFormat;

    const schema = dereference(resource.schema, validator);
    return {
        validate: (object) => validator.validate(object, schema),
    };
}
