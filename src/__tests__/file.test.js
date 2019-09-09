import { readFileSync } from 'fs';

import request from 'supertest';

import createApp from './app';

describe('app', () => {
    describe('CreateFileOperation', () => {
        it('returns 204', async () => {
            const app = createApp();
            const response = await request(app)
                .post('/fooFile')
                .attach('fooFile', 'src/__tests__/assets/1x1.png');
            expect(response.statusCode).toEqual(201);
            expect(response.body).toEqual({
                id: 'new-id',
            });
        });
    });

    describe('ReplaceFileOperation', () => {
        it('returns 204', async () => {
            const app = createApp();
            const response = await request(app)
                .put('/fooFile/id')
                .attach('fooFile', 'src/__tests__/assets/1x1.png');
            expect(response.statusCode).toEqual(200);
            expect(response.body).toEqual({
                id: 'id',
            });
        });
    });

    describe('RetrieveFileOperation', () => {
        it('returns 204', async () => {
            const data = readFileSync('src/__tests__/assets/1x1.png');

            const app = createApp();
            const response = await request(app)
                .get('/fooFile/id');

            expect(response.statusCode).toEqual(200);
            expect(response.headers['content-type']).toEqual('image/png');
            expect(response.body).toEqual(data);
        });
    });
});
