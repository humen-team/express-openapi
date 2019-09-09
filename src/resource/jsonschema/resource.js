import { difference, mapValues, omit } from 'lodash';
import { validate } from 'jsonschema';

import { UnprocessableEntity } from '../../errors';
import Reference from '../reference';
import Resource from '../resource';
import { buildProperty } from './property';
import castType from './types';

/* Defines an OpenAPI compatible resource using JSONSchema.
 */
export default class JSONSchemaResource extends Resource {
    constructor(schema, config) {
        super(config);
        this.schema = schema;
    }

    get id() {
        return this.config.namingStrategy.toName(this.schema.id);
    }

    get properties() {
        return this.schema.properties;
    }

    get required() {
        return this.schema.required;
    }

    get keys() {
        return Object.keys(this.schema.properties || {});
    }

    /* Convert this resource to an OpenAPI compatible definition.
     *
     * While OpenAPI leverages JSONSchema, it isn't 100% compatible; some conversion is required.
     */
    build(openapiVersion) {
        const { properties, required, type } = this.schema;
        return {
            // omit the `id` field
            properties: mapValues(
                properties,
                (value) => buildProperty(value, openapiVersion),
            ),
            required,
            type,
        };
    }

    cast(data) {
        return mapValues(
            data,
            (value, key) => castType(value, this.schema.properties[key].type),
        );
    }

    toList() {
        // avoid circular dependency by deferring import
        const JSONSchemaResourceList = require('./list').default; // eslint-disable-line global-require
        return new JSONSchemaResourceList(this);
    }

    toRef() {
        return new Reference(this.id);
    }

    /* Validate data against this JSONSchema schema.
     */
    validate(data) {
        const result = validate(data, this.schema);
        if (result.errors.length) {
            // NB: we could report on mutiple errors
            const { instance, message } = result.errors[0];
            throw new UnprocessableEntity({
                message: `${instance} ${message}`,
            });
        }
        return data;
    }

    /* Remove some properties from a resource.
     */
    without(id, ignore) {
        return new JSONSchemaResource({
            id,
            type: 'object',
            properties: omit(this.properties, ignore),
            required: difference(this.required, ignore),
        });
    }
}
