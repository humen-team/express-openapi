import {
    difference,
    intersection,
    isUndefined,
    mapValues,
    merge,
    omit,
    pick,
    union,
} from 'lodash';

import UnprocessableEntity from '../../errors/unprocessable_entity';
import Resource from '../resource';
import mapSchema from './map';
import { buildProperty } from './property';
import { castInputValue, castOutputValue } from './types';
import createValidator from './validator';

/* Defines an OpenAPI compatible resource using JSONSchema.
 */
export default class JSONSchemaResource extends Resource {
    constructor(schema, options) {
        super(options);
        // default to stricter validation
        const { additionalProperties, type } = schema;
        this.schema = {
            additionalProperties: additionalProperties === undefined
                ? false
                : additionalProperties,
            type: type || 'object',
            ...schema,
        };
        this.validator = null;
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

    /* Convert JSON data to this resource's expected types.
     */
    castInput(input) {
        return mapSchema(
            input,
            this.schema,
            // NB: keep unmapped values as additionalProperties
            (object, schema) => (schema ? castInputValue(object, schema) : object),
        );
    }

    /* Convert this resource's data to JSON types.
     */
    castOutput(output) {
        return mapSchema(
            output,
            this.schema,
            // NB: omit unmapped values to avoid additionalProperties
            (object, schema) => (schema ? castOutputValue(object, schema) : undefined),
        );
    }

    toList() {
        // avoid circular dependency by deferring import
        const JSONSchemaResourceList = require('./list').default; // eslint-disable-line global-require
        return new JSONSchemaResourceList(this);
    }

    /* Validate data against this JSONSchema schema.
     */
    validate(data) {
        if (!this.validator) {
            this.validator = createValidator(this);
        }

        const result = this.validator.validate(data);

        if (result.errors.length) {
            // NB: we could report on mutiple errors
            const { property, message } = result.errors[0];
            throw new UnprocessableEntity({
                message: `${property} ${message}`,
            });
        }
        return data;
    }

    /* Create a resource, requiring all properties.
     */
    static all(options = {}) {
        const { id = this.id, properties = {} } = options;
        return new JSONSchemaResource({
            id,
            properties,
            required: Object.keys(properties),
            type: 'object',
        });
    }

    /* Add some properties to a resource.
     */
    merge(options = {}) {
        const {
            id = this.id,
            properties = {},
            required = [],
        } = options;
        return new JSONSchemaResource({
            id,
            properties: merge(properties, this.properties),
            required: union(required, this.required),
            type: 'object',
        });
    }

    /* Remove some properties from a resource.
     */
    omit(options = {}) {
        const {
            id = this.id,
            properties = [],
            required,
        } = options;
        return new JSONSchemaResource({
            id,
            properties: omit(this.properties, properties),
            required: required || difference(this.required, properties),
            type: 'object',
        });
    }

    /* Pick some properties from a resource.
     */
    pick(options = {}) {
        const {
            id = this.id,
            properties = [],
            required,
        } = options;
        return new JSONSchemaResource({
            id,
            properties: pick(this.properties, properties),
            required: isUndefined(required) ? intersection(this.required, properties) : required,
            type: 'object',
        });
    }
}
