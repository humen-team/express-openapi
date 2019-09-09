import buildVersion from '../versions';

export default class File {
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
