import ResourceConfig from './config';

/* A resource defines a contract for the inputs and outputs of Operations.
 */
export default class Resource {
    constructor(config) {
        this.config = config || new ResourceConfig();
    }

    get keys() { // eslint-disable-line class-methods-use-this
        throw new Error('Resource.keys not implemented');
    }

    /* Generate the OpenAPI encoding of this resource for a given OpenAPI version.
     */
    build(openapiVersion) { // eslint-disable-line class-methods-use-this
        throw new Error(`Resource.build() not implemented for OpenAPI version: ${openapiVersion}`);
    }

    /* Cast string-valued data to this resource's expected types.
     */
    cast(data) { // eslint-disable-line class-methods-use-this
        return data;
    }

    /* Create a reference to this resource.
     */
    toRef() { // eslint-disable-line class-methods-use-this
        throw new Error('Resource.toRef() not implemented');
    }

    /* Validate data according to this resource's definition, returning the valid data.
     */
    validate(data) { // eslint-disable-line class-methods-use-this
        return data;
    }
}
