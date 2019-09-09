import CollectionOperation from './collection';

/* A REST-oriented Search operation.
 *
 * That is, `get` a collection of resources from the collection path, possibly filtered
 * through query string parameters.
 */
export default class Search extends CollectionOperation {
    constructor(options = {}) {
        super({
            method: 'get',
            ...options,
        });
    }
}
