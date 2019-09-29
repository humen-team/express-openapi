# express-openapi-rest

Opinionated REST APIs for `express` with `OpenAPI` support.

[OpenAPI](https://swagger.io/docs/specification/about/) (aka Swagger) is a widely used,
standards-based protocol for documenting HTTP-based APIs. A common challenge with OpenAPI
and related standards is that the documentation can diverge from the implementation.
`express-openapi-rest` addresses this problem by defining a *single source of truth* for
both API implementations and documentation.


## Operations

Within a traditional RESTful API for a resource `foo`, the API supports an opinionated
set of operations:

 - `GET    /foo`        - **search** within the collection of all `foo`
 - `POST   /foo`        - **create** a new instance within the collection of all `foo`
 - `PUT    /foo/:fooId` - **replace** an instance of `foo`
 - `GET    /foo/:fooId` - **retrieve** an instance of `foo`
 - `PATCH  /foo/:fooId` - **update** an instance of `foo`
 - `DELETE /foo/:fooId` - **delete** an instance of `foo`

These operations have predictable inputs, outputs, and statuses: for example **create**
will require an input request body that represents the required parameters of an
instance of `foo`, return an output response body that represents the created instance,
and return standard HTTP status codes (201, 422, etc.) depending on how the inputs
validate.


## Usage

`express-openapi-rest` defines concrete `Operation` classes for each standard RESTful
API; each of these operations defines enough information both to implement the API
function and to generate an OpenAPI specification:

    const create = new Create({
       // define a validator for the input
       input,
       // define a validator for the output
       output,
       // define a route function that creates an output from an input
       route,
       // define the name of the resource
       resourceName,
    });

    // register the resource with express
    create.register(app);

    // serve an openapi spec
    app.get('/openapi', serveSpec({ operations: [create] }));


## Resources

The resource definitions use [JSON Schema](https://json-schema.org/) to define the expected
input and output types and their validations.

For example:

    {
        "id": "CreateFoo",
        "type": "object",
        "properties": {
            "bar": {
                 "type": "string"
            }
        },
        "required": [
            "bar",
        ],
    }

Because resources used for input and output can be very similar, `express-openapi-rest`
also provides several utilities for building such resources from a common set of
properties.
