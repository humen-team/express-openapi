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
import { Validator } from 'jsonschema';

import UnprocessableEntity from '../../errors/unprocessable_entity';
import Reference from '../reference';
import Resource from '../resource';
import { buildProperty } from './property';
import { castInputValue, castOutputValue } from './types';

function deepCast(object, properties, cast) {
    return mapValues(
        object,
        (value, key) => {
            const property = properties[key];
            if (!property) {
                return undefined;
            }

            /*
            if (property.type === 'array') {
                return value.map(
                    (item) => deepCast(item, property.items, cast),
                );
            }

            if (property.type === 'object') {
                return deepCast(value, property, cast);
            }
            */

            return cast(value, property);
        },
    );
}

/* Defines an OpenAPI compatible resource using JSONSchema.
 */
export default class JSONSchemaResource extends Resource {
    constructor(schema, config) {
        super(config);
        // default to stricter validation
        const { additionalProperties } = schema;
        this.schema = {
            additionalProperties: additionalProperties === undefined
                ? false
                : additionalProperties,
            ...schema,
        };
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

    /* Convert JSON data to this resource's expected types.
     */
    castInput(input) {
        return deepCast(input, this.properties, castInputValue);
    }

    /* Convert this resource's data to JSON types.
     */
    castOutput(output) {
        return deepCast(output, this.properties, castOutputValue);
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
            type: 'object',
            properties: merge(properties, this.properties),
            required: union(required, this.required),
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
            type: 'object',
            properties: omit(this.properties, properties),
            required: required || difference(this.required, properties),
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
            type: 'object',
            properties: pick(this.properties, properties),
            required: isUndefined(required) ? intersection(this.required, properties) : required,
        });
    }

    /* Add internal definitions.
     */
    addDefinitions({ definitions }) {
        // XXX make definition management nicer
        this.schema.definitions = {};
        definitions.forEach(
            (definition) => {
                this.schema.definitions[definition.id] = definition;
            },
        );
        return this;
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
