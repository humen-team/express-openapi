# express-openapi-rest

Opinionated REST APIs for `express` with `OpenAPI` support.

[OpenAPI](https://swagger.io/docs/specification/about/) (aka Swagger) is a widely used,
standards-based protocol for documenting HTTP-based APIs. When using OpenAPI (or any
other form API documentation), many code bases suffer from divergence between the code
that implements the API and specification that documents it.

`express-openapi` addresses this problem by defining a *single source of truth*; the code
that implements the API is also the responsible for its documentation.


## Install

Using `npm`:

    npm install @humen-team/express-openapi --save

Using `yarn`:

    yarn add @humen-team/express-openapi


## Quick Start

The following will create a simple `express` app with a single resource and its OpenAPI spec:

 1. Import `express` and create an `app`:

    ```node
    const express = require('express');
    const app = express();
    ```

 2. Define a resource to represent your return type:

    ```node
    const { JSONSchemaResource } = require('@humen-team/express-openapi');
    const MyResource = JSONSchemaResource.all({
        id: 'MyResource',
        properties: {
            id: {
                type: 'string',
            },
        },
    });
    ``

 3. Define an operation to return an instance of your resource:

    ```node
    const { Retrieve } = require('@humen-team/express-openapi');
    const operation = new Retrieve({
        resourceName: MyResource.id,
        output: MyResource,
        route: (id) => ({ id }),
    });
    ```

 4. Register the operation with the app:

    ```node
    operation.register(app);
    ```

 5. Enable serving the OpenAPI spec:

    ```node
    app.get('/openapi', serveSpec({ operations: [operation] }));
    ```

 6. Start the server:

    ```node
    app.listen(3000, () => { console.log('Server listening on port 3000') });
    ```

You will now be able to retrieve a resource at [http://localhost:3000/my_resource/42]()
and see the OpenAPI spec at [http://localhost:3000/openapi]()


## Opinions, Resources, and Operations

`express-openapi` is opinionated. It views APIs from the( a?) lens of `REST` such that:

 -  APIs operate on `Resources`, which are addressed via the http request's HTTP `uri` (or `path`)
 -  APIs perform `Operations` against such `Resources`, as expressed via the HTTP `method`
 -  APIs accept and return representations of these `Resources`, frequently using `JSON`
 -  APIs use response `status codes` to encode the outcome of an `Operation`

Above all, the meaning of HTTP `methods`, `status codes`, etc. are taken to be as close to
the various [RFCs](https://tools.ietf.org/html/rfc2616) as possible.


## Defining Resources

The resource definitions use [JSON Schema](https://json-schema.org/) to define the expected
input and output types and their validations. These are wrapped in a class to simplify
standard operations.

For example:

```node
const { JSONSchemaResource } = require('@humen-team/express-openapi');

const Foo = JSONSchemaResource.all({
    id: 'Foo',
    properties: {
        bar: {
            type: 'string',
        },
    },
});
Foo.validate({ bar: 'a-string' });
```


## CRUD By Default

Most web applications provide create/retrieve/update/delete functionality on top of peristent
storage. Fortunately, standard REST provides a natural way to map such CRUD operations against
a hypothetical resource of type `foo`:


### Collection Operations

Some operations apply to the collection of all `foo`:

| Operation | Method | Path   | Meaning |
| --------- | ------ | ----   | ------- |
| `Create`  | `POST` | `/foo` | **search** within the collection |
| `Search`  | `GET`  | `/foo` | **create** a new instance within the collection |


### Instance Operations

The remaining operations apply to a specific instance of `foo`:

| Operation  | Method   | Path          | Meaning |
| ---------  | ------   | ----          | ------- |
| `Delete`   | `DELETE` | `/foo/:fooId` | **delete** an existing instance |
| `Replace`  | `PUT`    | `/foo/:fooId` | **replace** (overwrite) an instance |
| `Retrieve` | `GET`    | `/foo/:fooId` | **retrieve** an existing instance |
| `Update`   | `PATCH`  | `/foo/:fooId` | **update** an existing instance |


### Standard Operations

All of these operations should have consistent HTTP behavior, independent of their chosen resource; by
adhering to these conventions, `express-openapi` is able to generate boilerplate code and OpenAPI specs.

For example, the `Create` operation:
 -  Accepts an input request body that represents the required parameters for creating a new instance
 -  Returns an output response body that represents the created instance
 -  Returns the `201 Created` status code on success and various other status codes on error.


### Calling Conventions

When using an operation (e.g. `Retrieve` or `Create`), your application code is defined as a function
that is passed as the `route` option to the operation's constructor:

```node
const operation = new Retrieve({
    resourceName: MyResource.id,
    output: MyResource,
    route: (id) => ({ id }),
});
```

The `route` function accepts inputs using one of two signatures.

 -  For collection operations, the function will receive `(input, req, res)`, where `input`
    is derived from the operation's `input` resource and the HTTP request body or query string.

 -  For instance operations, the function will receive `(identifier, input, req, res)`, where
    `identifier` is added to the collection arguments, based on provided HTTP `path`.

Note that `req` and `res` are available (e.g. to access `res.locals`), but will generally not be
needed. The application code should not need to write to the HTTP response directly.

The `route` function is expected to return any output data (or a `Promise` thereof); this data will
be passed to the operation's `output` resource for validation and encoding.
