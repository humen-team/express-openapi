/* Create an example express app.
 */
import cors from 'cors';
import express from 'express';

import {
    Command,
    Namespace,
    Query,
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
    const foo = new Namespace('foo')
        .create({ input: CreateFoo, output: Foo, route: routes.create })
        .count({ input: CountFoo, route: routes.count })
        .delete({ route: routes.delete })
        .replace({ input: ReplaceFoo, output: Foo, route: routes.replace })
        .retrieve({ output: Foo, route: routes.retrieve })
        .search({ input: SearchFoo, output: Foo.toList(), route: routes.search })
        .update({ input: UpdateFoo, output: Foo, route: routes.update });

    const fooFile = new Namespace('fooFile')
        .createFile({ output: FooFile, route: routes.createFile })
        .replaceFile({ output: FooFile, route: routes.replaceFile })
        .retrieveFile({ route: routes.retrieveFile, produces: 'image/png' });

    const command = new Command({
        input: CommandInput,
        operationId: 'mycommand',
        output: CommandOutput,
        path: '/command',
        route: routes.command,
    });
    const query = new Query({
        input: QueryInput,
        operationId: 'myquery',
        output: QueryOutput,
        path: '/query',
        route: routes.query,
    });

    const operations = [
        foo,
        fooFile,
        command,
        query,
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
