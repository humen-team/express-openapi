import request from 'supertest';

import createApp from './app';
import validator, { openapi2, openapi3 } from './validate';

describe('app', () => {
    describe('OpenAPI', () => {
        describe('2.0', () => {
            it('returns 200', async () => {
                const app = createApp();
                const response = await request(app).get('/openapi/2.0');
                expect(response.statusCode).toEqual(200);
                validator.validate(response.body, openapi2, { throwError: true });
                expect(response.body).toMatchSnapshot();
            });
        });
        describe('3.0.0', () => {
            it('returns 200', async () => {
                const app = createApp();
                const response = await request(app).get('/openapi/3.0.0');
                expect(response.statusCode).toEqual(200);
                validator.validate(response.body, openapi3, { throwError: true });
                expect(response.body).toMatchSnapshot();
            });
        });
    });
});
