import pickVersion from '../versions';

import { OPENAPI_2_0 } from '../constants';

function normalize(type) {
    if (Array.isArray(type)) {
        return type.filter(
            (value) => !!value,
        )[0];
    }
    return type || 'string';
}

/* Defines an OpenAPI parameter.
 */
export default class Parameter {
    constructor({ name, parameterType, required, ref, type }) {
        this.name = name;
        this.parameterType = parameterType;
        this.required = required;
        this.ref = ref;
        this.type = type;
    }

    build(openapiVersion) {
        return pickVersion(this, 'build', openapiVersion)();
    }

    build20(openapiVersion = OPENAPI_2_0) {
        return {
            name: this.name,
            in: this.parameterType,
            required: this.required,
            schema: this.ref ? { $ref: this.ref.build(openapiVersion) } : undefined,
            type: this.type,
        };
    }

    build300() {
        return {
            name: this.name,
            in: this.parameterType,
            required: this.required,
            // NB: this.ref is only used for body parameters, which are not legal in 3.0.0
            schema: this.type ? { type: this.type } : undefined,
        };
    }

    static forBody({ input, resourceName }) {
        return new Parameter({
            name: resourceName || 'body',
            parameterType: 'body',
            required: true,
            ref: input.toRef(),
        });
    }

    static forHeader({ name, required, type }) {
        return new Parameter({
            name,
            parameterType: 'header',
            required: required || false,
            type: type || 'string',
        });
    }

    static forQuery({ input, name }) {
        return new Parameter({
            name,
            parameterType: 'query',
            required: input.required && input.required.includes(name),
            type: normalize(input.properties[name].type),
        });
    }

    static forPath({ identifierName, pathParameterType = 'string' }) {
        return new Parameter({
            name: identifierName,
            parameterType: 'path',
            required: true,
            type: pathParameterType,
        });
    }
}
