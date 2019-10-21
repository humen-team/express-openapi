import InstanceOperation from './instance';
import { UploadHandler } from '../handler';

/* A REST-oriented file upload operation.
 *
 * That is, behave like the `ReplaceOperation` except that the input resource
 * is a file upload.
 */
export default class ReplaceFileOperation extends InstanceOperation {
    constructor(options) {
        super({
            method: 'PUT',
            consumes: 'multipart/form-data',
            ...options,
        });
    }

    static createHandler(operation) {
        return new UploadHandler(operation);
    }
}
