import { pick } from 'lodash';

/* Cast data according to a resource.
 */
export function cast(data, resource) {
    if (!resource) {
        return {};
    }

    return resource.cast(pick(data, resource.keys));
}

/* Validate data against a resource.
 */
export function validate(data, resource) {
    if (!resource) {
        return {};
    }

    return resource.validate(pick(data, resource.keys));
}
