import { snakeCase } from 'lodash';

import Operation from './operation';

/* A `CollectionOperation` encapsulates a REST-oriented route that operates
 * on a collection of resources of a specific type.
 *
 * That is, it operates on the collection of all `foo` via the path `/foo`
 */
export default class CollectionOperation extends Operation {
    constructor({ resourceName, ...more }) {
        super({
            path: `/${snakeCase(resourceName)}`,
            tags: [
                resourceName,
            ],
            ...more,
        });
        this.resourceName = resourceName;
    }
}
