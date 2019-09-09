import { readFileSync } from 'fs';
import { Validator } from 'jsonschema';

import Spec from '../spec';

describe('Spec', () => {
    const openapi2 = JSON.parse(readFileSync('schemas/openapi/2.0/schema.json'));
    const openapi3 = JSON.parse(readFileSync('schemas/openapi/3.0/schema.json'));
    const jsonSchema = JSON.parse(readFileSync('schemas/json-schema/draft-04/schema.json'));
    const validator = new Validator();
    validator.addSchema(jsonSchema);

    describe('build', () => {
        it('encodes a valid swagger 2.0 spec with no operations', () => {
            const spec = new Spec().build('2.0');
            expect(spec).toMatchSnapshot();
            validator.validate(spec, openapi2, { throwError: true });
        });

        it('encodes a valid swagger 3.0 spec with no operations', () => {
            const spec = new Spec().build('3.0.0');
            expect(spec).toMatchSnapshot();
            validator.validate(spec, openapi3, { throwError: true });
        });
    });
});
