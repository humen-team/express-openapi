/* Validate file operations.
 */
import { readFileSync } from 'fs';

import request from 'supertest';

import createApp from './app';

describe('app', () => {
    describe('CreateFileOperation', () => {
        it('returns 204', async () => {
            const app = createApp();
            const response = await request(app)
                .post('/foo_file')
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
                .put('/foo_file/81490838-694e-44a7-a9f4-92dedb9a6116')
                .attach('fooFile', 'src/__tests__/assets/1x1.png');
            expect(response.statusCode).toEqual(200);
            expect(response.body).toEqual({
                id: '81490838-694e-44a7-a9f4-92dedb9a6116',
            });
        });
    });

    describe('RetrieveFileOperation', () => {
        it('returns 204', async () => {
            const data = readFileSync('src/__tests__/assets/1x1.png');

            const app = createApp();
            const response = await request(app)
                .get('/foo_file/81490838-694e-44a7-a9f4-92dedb9a6116');

            expect(response.statusCode).toEqual(200);
            expect(response.headers['content-type']).toEqual('image/png');
            expect(response.body).toEqual(data);
        });
    });
});
