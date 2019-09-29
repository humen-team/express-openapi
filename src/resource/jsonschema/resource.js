import {
    difference,
    mapValues,
    merge,
    omit,
    union,
} from 'lodash';
import { Validator } from 'jsonschema';

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
        this.validator = new Validator();
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

    get type() {
        return this.schema.type;
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

    /* Convert this resource to an OpenAPI compatible definition.
     *
     * While OpenAPI leverages JSONSchema, it isn't 100% compatible; some conversion is required.
     */
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
        const result = this.validator.validate(data, this.schema);
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
    omit(options = {}) {
        const { id = this.id, properties = [] } = options;
        return new JSONSchemaResource({
            id,
            type: 'object',
            properties: omit(this.properties, properties),
            required: difference(this.required, properties),
        });
    }

    /* Add some properties to a resource.
     */
    merge(options = {}) {
        const { id = this.id, properties = {}, required = [] } = options;
        return new JSONSchemaResource({
            id,
            type: 'object',
            properties: merge(properties, this.properties),
            required: union(required, this.required),
        });
    }

    /* Add another schema to the validator.
     */
    addSchemaReference({ $ref, schema }) {
        this.validator.addSchema({
            ...schema,
            id: `${this.id}${$ref}`,
        });
        return this;
    }
}
