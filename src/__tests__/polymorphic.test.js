import request from 'supertest';

import { Namespace } from '..';
import { newApp } from './app';
import { Pet, PetType } from './polymorphic';
import validator, { openapi2, openapi3 } from './validate';

function create(pet) {
    return pet;
}

function search() {
    return {
        count: 2,
        items: [{
            additionalProperty: 'ignore',
            info: {
                name: 'felix',
                lives: 9,
            },
            type: PetType.cat,
        }, {
            additionalProperty: 'ignore',
            info: {
                bestFriend: 'man',
                name: 'rex',
            },
            type: PetType.dog,
        }],
    };
}

describe('polymorphic schema', () => {
    let app;

    beforeEach(() => {
        const pet = new Namespace('pet')
            .create({ input: Pet, output: Pet, route: create })
            .search({ output: Pet.toList(), route: search });

        app = newApp({ operations: [pet] });
    });

    describe('search', () => {
        it('returns polymorphic properties', async () => {
            const response = await request(app).get('/pet');
            expect(response.statusCode).toEqual(200);
            expect(response.body.count).toEqual(2);
            expect(response.body.items.length).toEqual(2);
            expect(response.body.items[0].additionalProperty).not.toBeDefined();
            expect(response.body.items[0].info).toEqual({ lives: 9, name: 'felix' });
            expect(response.body.items[0].type).toEqual(PetType.cat);
            expect(response.body.items[1].info).toEqual({ bestFriend: 'man', name: 'rex' });
            expect(response.body.items[1].type).toEqual(PetType.dog);
        });
    });

    describe('create', () => {
        it('supports well-formed cats', async () => {
            const response = await request(app).post('/pet').send({
                info: {
                    lives: 9,
                    name: 'felix',
                },
                type: PetType.cat,
            });
            expect(response.statusCode).toEqual(201);
        });
        it('validates malformed cats', async () => {
            const response = await request(app).post('/pet').send({
                info: {
                    lives: 'nine',
                    name: 'felix',
                },
                type: PetType.cat,
            });
            expect(response.statusCode).toEqual(422);
        });
        it('validates cats with additional properties', async () => {
            const response = await request(app).post('/pet').send({
                info: {
                    landsOnFeet: true,
                    lives: 9,
                    name: 'felix',
                },
                type: PetType.cat,
            });
            expect(response.statusCode).toEqual(422);
        });
        it('supports well-formed dogs', async () => {
            const response = await request(app).post('/pet').send({
                info: {
                    bestFriend: 'man',
                    name: 'rex',
                },
                type: PetType.dog,
            });
            expect(response.statusCode).toEqual(201);
        });
        it('validates malformed dogs', async () => {
            const response = await request(app).post('/pet').send({
                info: {
                    bestFriend: true,
                    name: 'rex',
                },
                type: PetType.dog,
            });
            expect(response.statusCode).toEqual(422);
        });
        it('validates cats with additional properties', async () => {
            const response = await request(app).post('/pet').send({
                info: {
                    chasesTail: true,
                    bestFriend: 'man',
                    name: 'rex',
                },
                type: PetType.dog,
            });
            expect(response.statusCode).toEqual(422);
        });
        it('validates unicorns', async () => {
            const response = await request(app).post('/pet').send({
                info: {
                    // we intentionally do not define UnicornInfo
                    name: 'amalthea',
                },
                type: PetType.unicorn,
            });
            expect(response.statusCode).toEqual(422);
        });
    });

    describe('openapi 2.0', () => {
        it('is valid', async () => {
            const response = await request(app).get('/openapi/2.0');
            expect(response.statusCode).toEqual(200);
            validator.validate(response.body, openapi2, { throwError: true });
            expect(response.body).toMatchSnapshot();
        });
    });

    describe('openapi 3.0.0', () => {
        it('is valid', async () => {
            const response = await request(app).get('/openapi/3.0.0');
            expect(response.statusCode).toEqual(200);
            validator.validate(response.body, openapi3, { throwError: true });
            expect(response.body).toMatchSnapshot();
        });
    });
});
