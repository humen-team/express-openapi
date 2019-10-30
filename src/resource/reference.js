import pickVersion from '../versions';

/* A reference to a resource.
 *
 * Enables deferal of $ref encoding as late as possible to account for differences
 * between OpenAPI 2.0 and 3.0.0.
 *
 * At the moment, references are required to form a DAG. Cycles will break.
 */
export default class Reference {
    constructor(resource) {
        this.resource = resource;
    }

    get id() {
        return this.resource.id;
    }

    build(openapiVersion) {
        return pickVersion(this, 'build', openapiVersion)();
    }

    build20() {
        return `#/definitions/${this.id}`;
    }

    build300() {
        return `#/components/schemas/${this.id}`;
    }
}
