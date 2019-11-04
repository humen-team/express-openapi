import { readFileSync } from 'fs';
import { Validator } from 'jsonschema';

export const openapi2 = JSON.parse(readFileSync('schemas/openapi/2.0/schema.json'));
export const openapi3 = JSON.parse(readFileSync('schemas/openapi/3.0/schema.json'));
export const jsonSchema = JSON.parse(readFileSync('schemas/json-schema/draft-04/schema.json'));

const validator = new Validator();
validator.addSchema(jsonSchema);

export default validator;
