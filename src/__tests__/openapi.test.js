import { readFileSync } from 'fs';
import { Validator } from 'jsonschema';
import request from 'supertest';

import createApp from './app';

describe('app', () => {
    const openapi2 = JSON.parse(readFileSync('schemas/openapi/2.0/schema.json'));
    const openapi3 = JSON.parse(readFileSync('schemas/openapi/3.0/schema.json'));
    const jsonSchema = JSON.parse(readFileSync('schemas/json-schema/draft-04/schema.json'));
    const validator = new Validator();
    validator.addSchema(jsonSchema);

    describe('OpenAPI', () => {
        describe('2.0', () => {
            it('returns 200', async () => {
                const app = createApp();
                const response = await request(app).get('/openapi/2.0');
                expect(response.statusCode).toEqual(200);
                expect(response.body).toMatchSnapshot();
                validator.validate(response.body, openapi2, { throwError: true });
            });
        });
        describe('3.0.0', () => {
            it('returns 200', async () => {
                const app = createApp();
                const response = await request(app).get('/openapi/3.0.0');
                expect(response.statusCode).toEqual(200);
                expect(response.body).toMatchSnapshot();
                validator.validate(response.body, openapi3, { throwError: true });
            });
        });
    });
});
