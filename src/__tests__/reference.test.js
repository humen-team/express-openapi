import request from 'supertest';

import { Namespace } from '..';
import { newApp } from './app';
import { Parent } from './reference';
import validator, { openapi2, openapi3 } from './validate';

function search() {
    return {
        count: 3,
        items: [
            {
                name: 'parentWithChildAndGrandchild',
                child: {
                    name: 'childWithGrandchild',
                    grandchild: {
                        name: 'grandchild',
                    },
                },
            },
            // TODO: nullable references are non trivial to represent
            /*
            {
                name: 'parentWithChild',
                child: {
                    name: 'child',
                    grandchild: null,
                },
            },
            {
                name: 'parent',
                child: null,
            },
            */
        ],
    };
}

describe('schema references', () => {
    const operation = new Namespace('Parent')
        .search({ output: Parent.toList(), route: search });

    const app = newApp({ operations: [operation] });

    describe('search', () => {
        it('returns a list of parents with references to children', async () => {
            const response = await request(app).get('/parent');

            expect(response.statusCode).toEqual(200);
            expect(response.body.items.length).toEqual(1);
            expect(response.body).toMatchSnapshot();
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
