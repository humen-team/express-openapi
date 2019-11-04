import request from 'supertest';

import { Namespace } from '..';
import { newApp } from './app';
import { Parent } from './reference';

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
        ],
    };
}

describe('polymorphic schema', () => {
    const operation = new Namespace('Parent')
        .search({ output: Parent.toList(), route: search });

    const app = newApp({ operations: [operation] });

    describe('search', () => {
        it('returns a list of parents with references to children', async () => {
            const response = await request(app).get('/parent');

            expect(response.statusCode).toEqual(200);
            expect(response.body.items.length).toEqual(3);
            expect(response.body).toMatchSnapshot();
        });
    });
});
