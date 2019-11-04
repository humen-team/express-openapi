/* Validate RESTful operations.
 */
import request from 'supertest';

import createApp from './app';

describe('app', () => {
    describe('Count', () => {
        it('returns 200', async () => {
            const app = createApp();
            const response = await request(app).head('/foo');
            expect(response.statusCode).toEqual(204);
            expect(response.headers['x-total-count']).toEqual('0');
        });
    });

    describe('Create', () => {
        it('returns 201', async () => {
            const app = createApp();
            const response = await request(app).post('/foo').send({
                bar: 'baz',
            });
            expect(response.statusCode).toEqual(201);
            expect(response.body).toEqual({
                bar: 'baz',
                id: 'new-id',
            });
        });
    });

    describe('Search', () => {
        it('returns 200', async () => {
            const app = createApp();
            const response = await request(app).get('/foo').query({
                limit: 10,
                offset: 1,
            });
            expect(response.statusCode).toEqual(200);
            expect(response.body).toEqual({
                count: 0,
                items: [],
                limit: 10,
                offset: 1,
            });
        });
    });

    describe('Retrieve', () => {
        it('returns 200', async () => {
            const app = createApp();
            const response = await request(app).get('/foo/id');
            expect(response.statusCode).toEqual(200);
            expect(response.body).toEqual({
                bar: 'baz',
                id: 'id',
            });
        });
    });

    describe('Delete', () => {
        it('returns 200', async () => {
            const app = createApp();
            const response = await request(app).delete('/foo/id');
            expect(response.statusCode).toEqual(204);
        });
    });

    describe('Replace', () => {
        it('returns 200', async () => {
            const app = createApp();
            const response = await request(app).patch('/foo/id').send({
                bar: 'baz',
            });
            expect(response.statusCode).toEqual(200);
            expect(response.body).toEqual({
                bar: 'baz',
                id: 'id',
            });
        });
    });

    describe('Update', () => {
        it('returns 200', async () => {
            const app = createApp();
            const response = await request(app).put('/foo/id').send({
                bar: 'baz',
            });
            expect(response.statusCode).toEqual(200);
            expect(response.body).toEqual({
                bar: 'baz',
                id: 'id',
            });
        });
    });
});
