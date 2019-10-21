import { CREATED } from 'http-status-codes';

import CollectionOperation from './collection';
import { UploadHandler } from '../handler';

/* A REST-oriented file upload operation.
 *
 * That is, behave like the `CreateOperation` except that the input resource
 * is a file upload.
 */
export default class CreateFile extends CollectionOperation {
    constructor(options) {
        super({
            method: 'POST',
            consumes: 'multipart/form-data',
            statusCode: CREATED,
            ...options,
        });
    }

    static createHandler(operation) {
        return new UploadHandler(operation);
    }
}
