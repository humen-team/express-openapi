/* Validate command and query operations.
 */
import request from 'supertest';

import createApp from './app';

describe('app', () => {
    describe('Command', () => {
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

    describe('Query', () => {
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
