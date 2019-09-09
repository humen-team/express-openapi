import request from 'supertest';

import createApp from './app';

describe('app', () => {
    describe('CommandOperation', () => {
        it('returns 200', async () => {
            const app = createApp();
            const response = await request(app).post('/command').send({
                request: 'foo',
            });
            expect(response.statusCode).toEqual(200);
            expect(response.body).toEqual({
                response: 'foo',
            });
        });
    });

    describe('QueryOperation', () => {
        it('returns 200', async () => {
            const app = createApp();
            const response = await request(app).get('/query').query({
                request: 'foo',
            });
            expect(response.statusCode).toEqual(200);
            expect(response.body).toEqual({
                response: 'foo',
            });
        });
    });
});
