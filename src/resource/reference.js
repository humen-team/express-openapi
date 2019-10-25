import buildVersion from '../versions';

/* A reference to a resource.
 */
export default class Reference {
    constructor(id) {
        this.id = id;
    }

    build(openapiVersion) {
        return buildVersion(this, openapiVersion);
    }

    build20() {
        return {
            $ref: `#/definitions/${this.id}`,
        };
    }

    build300() {
        return {
            $ref: `#/components/schemas/${this.id}`,
        };
    }
}
