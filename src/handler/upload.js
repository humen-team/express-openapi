import { promisify } from 'util';
import { tmpdir } from 'os';

import multer from 'multer';

import { UnprocessableEntity } from '../errors';
import Handler from './handler';

/* Handle uploading a file.
 */
export default class UploadHandler extends Handler {
    constructor(options) {
        super(options);
        this.multer = options.multer || multer({
            dest: `${tmpdir()}/uploads`,
        });
        this.resourceName = options.resourceName;
    }

    get uploadName() {
        return this.resourceName;
    }

    async processInput(req, res) {
        await promisify(this.multer.single(this.uploadName))(req, res);
        if (!req.file) {
            throw new UnprocessableEntity(
                `Expected multipart/form-data to contain '${this.uploadName}' input`,
            );
        }
        return req.file;
    }
}
