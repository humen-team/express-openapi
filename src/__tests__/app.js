/* Create an example express app.
 */
import cors from 'cors';
import express from 'express';

import {
    Create,
    CreateFile,
    Command,
    Count,
    Delete,
    Query,
    Replace,
    ReplaceFile,
    Retrieve,
    RetrieveFile,
    Update,
    Search,
    serveSpec,
} from '..';
import routes from './routes';
import {
    CommandInput,
    CommandOutput,
    CountFoo,
    CreateFoo,
    Foo,
    FooFile,
    QueryInput,
    QueryOutput,
    ReplaceFoo,
    SearchFoo,
    UpdateFoo,
} from './resources';

export function newApp({ operations }) {
    const app = express();

    app.use(cors());
    app.use(express.json());

    operations.forEach((operation) => {
        operation.register(app);
    });

    app.get('/openapi/2.0', serveSpec({ openapiVersion: '2.0', operations }));
    app.get('/openapi/3.0.0', serveSpec({ openapiVersion: '3.0.0', operations }));

    return app;
}

export default function createApp() {
    const operations = [
        new Create({ input: CreateFoo, output: Foo, route: routes.create, resourceName: 'foo' }),
        new Count({ input: CountFoo, route: routes.count, resourceName: 'foo' }),
        new Delete({ route: routes.delete, resourceName: 'foo' }),
        new Replace({ input: ReplaceFoo, output: Foo, route: routes.replace, resourceName: 'foo' }),
        new Retrieve({ output: Foo, route: routes.retrieve, resourceName: 'foo' }),
        new Search({ input: SearchFoo, output: Foo.toList(), route: routes.search, resourceName: 'foo' }),
        new Update({ input: UpdateFoo, output: Foo, route: routes.update, resourceName: 'foo' }),

        new CreateFile({ output: FooFile, route: routes.createFile, resourceName: 'fooFile' }),
        new ReplaceFile({ output: FooFile, route: routes.replaceFile, resourceName: 'fooFile' }),
        new RetrieveFile({ route: routes.retrieveFile, produces: 'image/png', resourceName: 'fooFile' }),

        new Command({
            input: CommandInput,
            operationId: 'mycommand',
            output: CommandOutput,
            path: '/command',
            route: routes.command,
        }),
        new Query({
            input: QueryInput,
            operationId: 'myquery',
            output: QueryOutput,
            path: '/query',
            route: routes.query,
        }),
    ];

    return newApp({ operations });
}

if (require.main === module) {
    const port = 3000;
    const app = createApp();
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`); // eslint-disable-line no-console
    });
}
