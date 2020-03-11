import {
    concat,
    difference,
    flatten,
    intersection,
    isPlainObject,
    isUndefined,
    merge,
    mergeWith,
    omit,
    pick,
    sortedUniq,
    union,
} from 'lodash';

import UnprocessableEntity from '../../errors/unprocessable_entity';
import Reference from '../reference';
import Resource from '../resource';
import buildOpenAPI from './builder';
import mapSchema from './map';
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
            additionalProperties: additionalProperties || false,
            type: type || 'object',
            ...schema,
        };
        this.validator = null;
    }

    get id() {
        return this.config.namingStrategy.toResourceId(this.schema.id);
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
            properties: buildOpenAPI(properties, openapiVersion, this.id),
            required: (!required || !required.length) ? undefined : required,
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

    listRefs() {
        function findRefs(object) {
            if (object instanceof Reference) {
                return [object];
            }
            if (Array.isArray(object)) {
                return flatten(object.map(findRefs));
            }
            if (isPlainObject(object)) {
                return flatten(Object.values(object).map(findRefs));
            }
            return [];
        }

        return findRefs(this.schema);
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
        const {
            additionalProperties = false,
            id = this.id,
            properties = {},
        } = options;
        return new JSONSchemaResource({
            additionalProperties,
            id,
            properties,
            required: Object.keys(properties),
            type: 'object',
        });
    }

    /* Create a resource that is a choice of other resources.
     *
     * OpenAPI 2.0 uses JSONSchema draft-04, which only supports the `oneOf` or `allOf` qualifiers
     * in the root of a schema (and not within property declarations). The workaround is to create
     * a new choice type that includes the *union* of all properties and use it as a reference.
     */
    static choice(options = {}) {
        const {
            additionalProperties = false,
            exclusive = true,
            id = this.id,
            resources = [],
        } = options;

        function mergeEnums(objValue, sourceValue, key) {
            // if both obj and source are enums
            if (objValue && sourceValue && key === 'enum') {
                // merge their values together
                return sortedUniq(concat(objValue, sourceValue).sort());
            }
            // otherwise, fall back to the default merge
            return undefined;
        }

        return new JSONSchemaResource({
            additionalProperties,
            id,
            properties: resources.reduce(
                (obj, resource) => mergeWith(
                    obj,
                    resource.properties,
                    mergeEnums,
                ),
                {},
            ),
            [exclusive ? 'oneOf' : 'anyOf']: resources.map(
                (resource) => ({ $ref: resource.toRef() }),
            ),
        });
    }

    /* Add some properties to a resource.
     */
    merge(options = {}) {
        const {
            additionalProperties = false,
            id = this.id,
            properties = {},
            required = [],
        } = options;
        return new JSONSchemaResource({
            additionalProperties,
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
            additionalProperties = false,
            id = this.id,
            properties = [],
            required,
        } = options;
        return new JSONSchemaResource({
            additionalProperties,
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
            additionalProperties = false,
            id = this.id,
            properties = [],
            required,
        } = options;
        return new JSONSchemaResource({
            additionalProperties,
            id,
            properties: pick(this.properties, properties),
            required: isUndefined(required) ? intersection(this.required, properties) : required,
            type: 'object',
        });
    }
}
