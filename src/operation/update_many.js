import CollectionOperation from './collection';

/* A REST-oriented Update collection operation.
 *
 * That is, `update` resource(s) through their collection path.
 */
export default class UpdateMany extends CollectionOperation {
    constructor(options) {
        super({
            method: 'PATCH',
            ...options,
        });
    }
}
