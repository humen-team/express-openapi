import buildVersion from '../versions';

/* The type for a resource that uses a file.
 */
export default class FileType {
    build(openapiVersion) {
        return buildVersion(this, openapiVersion);
    }

    build20() { // eslint-disable-line class-methods-use-this
        return {
            type: 'file',
        };
    }

    build300() { // eslint-disable-line class-methods-use-this
        return {
            type: 'string',
            format: 'binary',
        };
    }
}
