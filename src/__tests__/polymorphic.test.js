import request from 'supertest';

import { Create, Search } from '..';
import { newApp } from './app';
import { Pet, PetType } from './fixtures';

function create(pet) {
    return pet;
}

function search() {
    return {
        count: 2,
        items: [{
            additionalProperty: 'ignore',
            info: {
                lives: 9,
            },
            name: 'Felix',
            type: PetType.cat,
        }, {
            additionalProperty: 'ignore',
            info: {
                bestFriend: 'man',
            },
            name: 'Rex',
            type: PetType.dog,
        }],
    };
}

describe('polymorphic schema', () => {
    let app;

    beforeEach(() => {
        const operations = [
            new Create({ input: Pet, output: Pet, resourceName: 'pet', route: create }),
            new Search({ output: Pet.toList(), resourceName: 'pet', route: search }),
        ];
        app = newApp({ operations });
    });

    describe('search', () => {
        it('returns polymorphic properties', async () => {
            const response = await request(app).get('/pet');
            expect(response.statusCode).toEqual(200);
            expect(response.body.count).toEqual(2);
            expect(response.body.items.length).toEqual(2);
            expect(response.body.items[0].additionalProperty).not.toBeDefined();
            expect(response.body.items[0].info).toEqual({ lives: 9 });
            expect(response.body.items[0].name).toEqual('Felix');
            expect(response.body.items[0].type).toEqual(PetType.cat);
            expect(response.body.items[1].info).toEqual({ bestFriend: 'man' });
            expect(response.body.items[1].name).toEqual('Rex');
            expect(response.body.items[1].type).toEqual(PetType.dog);
        });
    });

    describe('create', () => {
        it('supports well-formed cats', async () => {
            const response = await request(app).post('/pet').send({
                info: {
                    lives: 9,
                },
                name: 'Felix',
                type: PetType.cat,
            });
            expect(response.statusCode).toEqual(201);
        });
        it('validates malformed cats', async () => {
            const response = await request(app).post('/pet').send({
                info: {
                    lives: 'nine',
                },
                name: 'Felix',
                type: PetType.cat,
            });
            expect(response.statusCode).toEqual(422);
        });
        it('validates cats with additional properties', async () => {
            const response = await request(app).post('/pet').send({
                info: {
                    landsOnFeet: true,
                    lives: 9,
                },
                name: 'Felix',
                type: PetType.cat,
            });
            expect(response.statusCode).toEqual(422);
        });
        it('supports well-formed dogs', async () => {
            const response = await request(app).post('/pet').send({
                info: {
                    bestFriend: 'man',
                },
                name: 'Rex',
                type: PetType.dog,
            });
            expect(response.statusCode).toEqual(201);
        });
        it('validates malformed dogs', async () => {
            const response = await request(app).post('/pet').send({
                info: {
                    bestFriend: true,
                },
                name: 'Rex',
                type: PetType.dog,
            });
            expect(response.statusCode).toEqual(422);
        });
        it('validates cats with additional properties', async () => {
            const response = await request(app).post('/pet').send({
                info: {
                    chasesTail: true,
                    bestFriend: 'man',
                },
                name: 'Rex',
                type: PetType.dog,
            });
            expect(response.statusCode).toEqual(422);
        });
    });
});
