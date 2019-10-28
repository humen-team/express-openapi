import ResourceConfig from './config';
import Reference from './reference';

/* A resource defines a contract for the inputs and outputs of Operations.
 */
export default class Resource {
    constructor(options = {}) {
        const { config } = options;

        this.config = config || new ResourceConfig();
    }

    get options() {
        return {
            config: this.config,
        };
    }

    get keys() { // eslint-disable-line class-methods-use-this
        throw new Error('Resource.keys not implemented');
    }

    /* Generate the OpenAPI encoding of this resource for a given OpenAPI version.
     */
    build(openapiVersion) { // eslint-disable-line class-methods-use-this
        throw new Error(`Resource.build() not implemented for OpenAPI version: ${openapiVersion}`);
    }

    /* Cast JSON data to this resource's expected types.
     */
    castInput(data) { // eslint-disable-line class-methods-use-this
        return data;
    }

    /* Cast this resource's expected types to JSON.
     */
    castOutput(data) { // eslint-disable-line class-methods-use-this
        return data;
    }

    /* Create a reference to this resource.
     */
    toRef() { // eslint-disable-line class-methods-use-this
        return new Reference(this);
    }

    /* Validate data according to this resource's definition, returning the valid data.
     */
    validate(data) { // eslint-disable-line class-methods-use-this
        return data;
    }
}
